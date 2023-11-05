"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Popup from "reactjs-popup";
import Slider from './ui/slider';
import Points from './ui/points';

const rawData: { address: string; group: number; points: number; }[] = require("../app/data/data.json");

const convertPointsToDimensions = (data: { address: string; group: number; points: number; }[]): CustomNode[] => {
  return data.map(d => ({ ...d, width: d.points, height: d.points, points: d.points }));
};

interface CustomNode extends d3.SimulationNodeDatum {
  address: string;
  group: number;
  width: number;
  height: number;
  points: number; // Add this line
  x?: number;
  y?: number;
}

const data: CustomNode[] = convertPointsToDimensions(rawData);

const Arena: React.FC = () => {
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
  .data(data)
  .join("circle")
  .attr("r", d => radiusScale(d.width * d.height))
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .style("fill", d => color(d.group.toString()) as string)
  .style("fill-opacity", 0.1)
  .attr("stroke", "rgb(255,255,255,0.2)")
  .style("stroke-width", 1)
  .style("cursor", "pointer")
  .on("mouseover", function() { 
    d3.select(this)
      .transition()
      .duration(200) // duration of the transition in milliseconds
      .style("fill-opacity", 0.2); 
  })
  .on("mouseout", function() { 
    d3.select(this)
      .transition()
      .duration(200) // duration of the transition in milliseconds
      .style("fill-opacity", 0.1); 
  });

      node.on("click", (event, d) => {
        setCurrentNode(d);
        setCurrentGroup(d.group);
        setIsOpen(true);
        const popupHeight = 300; // height of the popup
        const buffer = 24; // buffer space
        const minYPos = window.innerHeight - popupHeight - buffer;
        setXPos(event.clientX);
        setYPos(Math.min(event.clientY, minYPos));
      });

    const labels = svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text(d => d.address)
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
      .nodes(data)
      .on("tick", () => {
        node
          .attr("cx", d => d.x ?? 0)
          .attr("cy", d => d.y ?? 0);
    
        labels
          .attr("x", d => d.x ?? 0)
          .attr("y", d => d.y ?? 0);
    
        const group1Nodes = data.filter(d => d.group === 1);
    
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
      <svg ref={ref} className='mt-24'></svg>
      {currentNode && (
        <Popup
          open={isOpen}
          closeOnDocumentClick
          onClose={() => setIsOpen(false)}
          contentStyle={{ top: `${yPos}px`, left: `${xPos}px`, position: 'absolute' }}
        >
          <div className={`flex flex-col text-white ${currentGroup === 2 ? 'bg-violet' : 'bg-eet'} bg-opacity-20 backdrop-blur-2xl border-white border-opacity-20 border text-black p-4 rounded-md min-w-[300px] h-[300px] w-full justify-between`}>
            <div className='flex flex-col gap-4 h-full'>
              <div className='flex flex-row gap-1 text-white justify-between pb-3 border-b border-white border-opacity-30'>
                <h2 className='font-bold text-xl'>{currentNode.address}</h2>
                <Points label={currentNode.points.toString()} />
              </div>
              <div className='flex flex-col gap-3 h-full center'>
                <div className='flex flex-col gap-0 center'>
                  <h2 className='font-bold text-3xl'>75%</h2>
                  <p className='text-xs'>Win Probability</p>
                </div>
                <Slider defaultValue={5} maxValue={10} step={1} />
              </div>
            </div>
            <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black outline-none">
              Challenge
            </button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default Arena;