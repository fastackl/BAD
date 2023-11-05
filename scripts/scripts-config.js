module.exports = {
    "localhost": {
        "deploy.js": [
            {
                name: "K21"
            },
            {
                name: "Base64"
            },
            {
                name: "StringsMin"
            },
            {
                name: "BytesLib"
            },
            {
                name: "GIF89a"
            },
            {
                name: "API"
            },
            {
                name: "SignedWadMath"
            },
            {
                name: "GUAMetadata",
                libraries: {
                    "StringsMin": "StringsMin.address",
                    "BytesLib": "BytesLib.address",
                }
            },
            {
                name: "FetusMovement",
            },
            {
                name: "BaGua",
            },
            {
                name: "Omikujify",
            },
            {
                name: "BiChing",
            },
            {
                name: "FortuneRouter",
            },
            {
                name: "Fortunes01",
            },
            {
                name: "Fortunes02",
            },
            {
                name: "Fortunes03",
            },
            {
                name: "Fortunes04",
            },
            {
                name: "EETRenderEngine",
                constructorArgs: ["Omikujify.address","BiChing.address","FortuneRouter.address"],
                libraries: {
                    "BytesLib": "BytesLib.address",
                    "GIF89a": "GIF89a.address",
                }
            },
            {
                name: "EthCurve",
                libraries: {
                    "SignedWadMath": "SignedWadMath.address",
                }
            },
            {
                name: "K21Curve",
                libraries: {
                    "SignedWadMath": "SignedWadMath.address",
                }
            },
            {
                name: "FeeRecipient",
            },
            {
                name: "BondingCurve",
                constructorArgs: ["EthCurve.address","K21Curve.address","K21.address","FeeRecipient.address"],
                libraries: {
                    "SignedWadMath": "SignedWadMath.address",
                }
            },
            {
                name: "ScoreBoard",
            },
            {
                name: "GUA",
                constructorArgs: ["0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f",["0xFFFFFF","0x2FC09F","0x40E0D0","0x735CE5","0xB759E5","0xFF69B4","0xFF6347","0xF2AF4A","0xFFD700","0xE36921","0x69C244","0x10ED10","0xF53077","0x56A8D9","0xFF8C00","0x000000"]],
                libraries: {
                    "GIF89a": "GIF89a.address",
                    "API": "API.address",
                }
            },
            {
                name: "EET",
                constructorArgs: ["0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f",["0xFFFFFF","0x35A98E","0x5F5FBC"]],
                libraries: {
                    "GIF89a": "GIF89a.address",
                }
            },
            {
                name: "MissionControl",
            },
            {
                name: "SafeGuard",
                constructorArgs: ["0xB18Fa63A585f569E1d67aDd5A75516B5a91250B1","0xB18Fa63A585f569E1d67aDd5A75516B5a91250B1", "MissionControl.address"],
            },
        ],
        "initialize.js": [
            {
                contract : "GUAMetadata",
                function: "setFetusMovementContract",
                args: ["FetusMovement.address"]
            },
            {
                contract : "FortuneRouter",
                function: "setDictionaries",
                args: [["Fortunes01.address","Fortunes02.address","Fortunes03.address","Fortunes04.address"],false]
            },
            {
                contract : "EthCurve",
                function: "initialize",
                args: [100,1000,30,65,95]
            },
            {
                contract : "K21Curve",
                function: "initialize",
                args: [100,1000,30,65,95]
            },
            {
                contract : "EthCurve",
                function: "setBondingCurve",
                args: ["BondingCurve.address"]
            },
            {
                contract : "K21Curve",
                function: "setBondingCurve",
                args: ["BondingCurve.address"]
            },
            {
                contract : "FeeRecipient",
                function: "setAddresses",
                args: ["K21.address","BondingCurve.address","0xAeE81A3ce386D21cCDE777f88AAe1AEcc76b532D","0x129f33143e97e28E19CD2fBAAF7869DE40d3Bb7f"]
            },
            {
                contract : "GUA",
                function: "setDependencies",
                args: ["GUAMetadata.address","BaGua.address",false]
            },
            {
                contract : "FetusMovement",
                function: "setGuaContract",
                args: ["GUAMetadata.address",false]
            },
            {
                contract : "GUA",
                function: "addReader",
                args: ["BondingCurve.address"]
            },
            {
                contract : "EET",
                function: "setDependencies",
                args: ["GUA.address","BondingCurve.address","EETRenderEngine.address","MissionControl.address",false]
            },
            {
                contract : "GUA",
                function: "addReader",
                args: ["EET.address"]
            },
            {
                contract : "EETRenderEngine",
                function: "setEET",
                args: ["EET.address"]
            },
            {
                contract : "BondingCurve",
                function: "setDependencies",
                args: ["GUA.address","EET.address",false]
            },
            {
                contract : "MissionControl",
                function: "setEET",
                args: ["EET.address"]
            },
        ],
        "verify.js": []
    },
    "goerli": {
        "deploy.js": [
            {
                name: "MissionControl",
            }
        ],
        "initialize.js": [
            // {
            //     contract : "EET",
            //     function: "setDependencies",
            //     args: ["0x3d46A1F76ddd5f75C03b6DAc6B8e37bC58871d63","0x9D1260420c895D682d9BE7298d15D0E6343ce440","0xAab571fD047F96e94Fa3ed48650b1e79C9290321","MissionControl.address",false]
            // },
            {
                contract : "MissionControl",
                function: "setEET",
                args: ["0x5Bc93bF040Deed78b63214f4F37FA82A3c30e1cA"]
            },
        ],
        "verify.js": ["MissionControl"]
    },
    "mainnet": {}
}
