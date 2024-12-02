import React from "react";
import { SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
	size?: number;
	source: React.FC<SvgProps>;
}

const Icon = (props: IconProps) => {
	const { source: Source, color = "currentColor", size = 24 } = props;

	return <Source {...props} width={size} height={size} fill={color} />;
};

export default Icon;
