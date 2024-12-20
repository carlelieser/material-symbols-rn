# React Native + Material Symbols
This library provides a set of React Native components that render Material Symbols icons as SVGs using [react-native-svg](https://github.com/software-mansion/react-native-svg).

## Installation
```bash
npm install material-symbols-rn
```

## Usage

```typescript
// Named import
import { Abc } from "material-symbols-rn";

// Default import
import Abc from "material-symbols-rn/Abc";

// Style variations
import AbcOutlined from "material-symbols-rn/AbcOutlined"; // Same as "Abc"
import AbcRounded from "material-symbols-rn/AbcRounded";
import AbcSharp from "material-symbols-rn/AbcSharp";
import AbcRoundedFill from "material-symbols-rn/AbcRoundedFill";

// Icons with numerical names
import TenK from "material-symbols-rn/TenK"; // Represents "10k"
import SixtyFps from "material-symbols-rn/SixtyFps"; // Represents "60fps"
```