import Svg, { G, Path } from "react-native-svg"
import React from 'react';
import { ViewStyle } from "react-native";
import { SVGTypes } from "../../types";

export const SVG_MinusRegular = ({color, width, height, style} : SVGTypes ) => (
    <Svg width={width} height={height} viewBox="0 0 32 32" style={style}>
        <G transform="matrix(39.7188,0,0,39.7188,-4.94545,29.9733)">
            <Path 
                d="M0.168,-0.308L0.887,-0.308C0.895,-0.308 0.902,-0.31 0.908,-0.314C0.915,-0.318 0.92,-0.323 0.924,-0.33C0.928,-0.337 0.93,-0.344 0.93,-0.352C0.93,-0.36 0.928,-0.367 0.924,-0.374C0.92,-0.38 0.915,-0.386 0.908,-0.39C0.902,-0.394 0.895,-0.396 0.887,-0.396L0.168,-0.396C0.16,-0.396 0.153,-0.394 0.146,-0.39C0.14,-0.386 0.135,-0.38 0.131,-0.374C0.127,-0.367 0.125,-0.36 0.125,-0.352C0.125,-0.344 0.127,-0.337 0.131,-0.33C0.135,-0.323 0.14,-0.318 0.146,-0.314C0.153,-0.31 0.16,-0.308 0.168,-0.308Z"
                fill={color}
            />
        </G>
    </Svg>
)