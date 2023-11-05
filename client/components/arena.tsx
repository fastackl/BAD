"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Popup from "reactjs-popup";
import Slider from './ui/slider';
import Points from './ui/points';
import truncateEthAddress from 'truncate-eth-address'
import { Web3Button } from "@thirdweb-dev/react";

const convertPointsToDimensions = (data: { name: string; group: number; points: number; index: number }[]): CustomNode[] => {
  return data.map(d => ({ ...d, width: d.points, height: d.points, points: d.points }));
};

interface CustomNode extends d3.SimulationNodeDatum {
  name: string;
  group: number;
  width: number;
  height: number;
  points: number; // Add this line
  index: number;
  x?: number;
  y?: number;
}

interface ArenaProps {
  data: { name: string; group: number; points: number; width: number; height: number; index: number }[];
}

const Arena: React.FC<ArenaProps> = ({ data }) => {
  const convertedData: CustomNode[] = convertPointsToDimensions(data);
  const ref = useRef<SVGSVGElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<CustomNode | null>(null);
  const [currentGroup, setCurrentGroup] = useState<number | null>(null);

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleOrdinal()
      .domain([1, 2].map(String))
      .range([300, 100]);

    const color = d3.scaleOrdinal()
      .domain([1, 2].map(String))
      .range(["#ffffff", "#735ce5"]);

    const maxData = d3.max(data, d => d.width * d.height) || 0;

    const radiusScale = d3.scaleSqrt()
      .domain([0, maxData])
      .range([0, window.innerWidth * 0.1]);

    const node = svg.append("g")
      .selectAll("circle")
      .data(convertedData)
      .join("circle")
      .attr("r", d => Math.max(15, radiusScale(d.width * d.height))) // Set minimum radius to 2
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => {
        const isMatch = data.slice(0, 3).some(el => el.name === data[3].name);
        if (isMatch && d.group === 2) {
          return 'none';
        }
        return color(d.group.toString()) as string;
      })
      .style("fill-opacity", 0.1)
      .attr("stroke", d => {
        const isMatch = data.slice(0, 3).some(el => el.name === data[3].name);
        if (isMatch && d.group === 2) {
          return 'none';
        }
        return "rgb(255,255,255,0.2)";
      })
      .style("stroke-width", 1)
      .style("cursor", d => {
        const isMatch = d.name === data[3].name;
        return isMatch ? 'default' : 'pointer';
      })
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200) // duration of the transition in milliseconds
          .style("fill-opacity", 0.2);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200) // duration of the transition in milliseconds
          .style("fill-opacity", 0.1);
      });

    node.on("click", (event, d) => {
      // Check if the name of the node matches the name of the fourth element
      const isMatch = d.name === data[3].name;
      // If it matches, return early to prevent the click action
      if (isMatch) {
        return;
      }

      setCurrentNode(d);
      setCurrentGroup(d.group);
      setIsOpen(true);
      const popupHeight = 360; // height of the popup
      const buffer = 24; // buffer space
      const minYPos = window.innerHeight - popupHeight - buffer;
      setXPos(event.clientX);
      setYPos(Math.min(event.clientY, minYPos));
    });

    const labels = svg.append("g")
      .selectAll("text")
      .data(convertedData)
      .join("text")
      .text(d => {
        const isMatch = data.slice(0, 3).some(el => el.name === data[3].name);
        if (isMatch && d.group === 2) {
          return '';
        }
        return truncateEthAddress(d.name);
      })
      .attr("x", d => d.x ?? 0)
      .attr("y", d => d.y ?? 0)
      .style("text-anchor", "middle")
      .style("fill", "#ffffff")
      .style("pointer-events", "none");

    const simulation = d3.forceSimulation<CustomNode>()
      .force("x", d3.forceX<CustomNode>().strength(0.05).x(d => {
        const value = x(d.group.toString());
        return (typeof value === 'number' ? value : 0);
      }))
      .force("y", d3.forceY<CustomNode>().strength(0.2).y(height / 2))
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("collide", d3.forceCollide<CustomNode>().strength(.1).radius((d: CustomNode) => radiusScale(d.width * d.height) + 8).iterations(1))
      .force("radial", d3.forceRadial<CustomNode>(d => d.group === 1 ? 200 : 500, width / 2, height / 3));

    simulation
      .nodes(convertedData)
      .on("tick", () => {
        node
          .attr("cx", d => d.x ?? 0)
          .attr("cy", d => d.y ?? 0);

        labels
          .attr("x", d => d.x ?? 0)
          .attr("y", d => d.y ?? 0);

        const group1Nodes = convertedData.filter(d => d.group === 1);

        const enclosingCircle = d3.packEnclose(group1Nodes.map(d => ({ x: d.x ?? 0, y: d.y ?? 0, r: radiusScale(d.width * d.height) })));

        svg.select(".enclosing-circle")
          .attr("cx", enclosingCircle.x)
          .attr("cy", enclosingCircle.y)
          .attr("r", enclosingCircle.r + 5);
      });

    svg.append("circle")
      .attr("class", "enclosing-circle")
      .style("fill", "rgba(47, 192, 159, 0.1)")
      .style("stroke", "rgba(47, 192, 159, 1)")
      .style("stroke-width", 1);

  }, []);

  return (
    <>
      <svg ref={ref} className='mt-4'></svg>
      {currentNode && (
        <Popup
          open={isOpen}
          closeOnDocumentClick
          onClose={() => setIsOpen(false)}
          contentStyle={{ top: `${yPos}px`, left: `${xPos}px`, position: 'absolute' }}
        >
          <div className={`flex flex-col text-white ${currentGroup === 2 ? 'bg-violet' : 'bg-eet'} bg-opacity-20 backdrop-blur-2xl border-white border-opacity-20 border text-black p-4 rounded-md min-w-[300px] h-[360px] w-full justify-between`}>
            <div className='flex flex-col gap-4 h-full'>
              <div className='flex flex-row gap-1 text-white justify-between pb-3 border-b border-white border-opacity-30'>
                <h2 className='font-bold text-xl'>{truncateEthAddress(currentNode.name)}</h2>
                <Points label={currentNode.points.toString()} />
              </div>
              <p className='text-xs'>{`Index: ${currentNode.index}`}</p>
              <div className='flex flex-col gap-3 h-full center'>
                <div className='flex flex-col gap-0 center'>
                  <h2 className='font-bold text-3xl'>50%</h2>
                  <p className='text-xs'>Win Probability</p>
                </div>
                <Slider defaultValue={1} maxValue={data[3].points} step={1} />
                <input type="text" className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none" placeholder="Intent" />
              </div>
            </div>
            <Web3Button
              contractAddress="0x1e3ae9a1ceDE4Cd9F5331afF434ADCBEa4189019"
              action={(contract) => {
                const inputElement = document.querySelector('input');
                const intentInput = inputElement ? inputElement.value : '';
                const sliderElement = document.querySelector('.slider') as HTMLInputElement;
                const sliderValue = sliderElement ? sliderElement.value : '1';
                contract.call("challenge", [currentNode.index, sliderValue, "For Frodo!"])
              }}
            >
              Challenge
            </Web3Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default Arena;