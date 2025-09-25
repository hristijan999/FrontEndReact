import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface SliderSizesProps {
    value: number[]; // <-- controlled value
    min: number;
    max: number;
    onFinalChange: (val: number[]) => void;
}

function valuetext(value: number) {
    return `${value} den.`;
}

export default function SliderSizes({
                                        value,
                                        min,
                                        max,
                                        onFinalChange,
                                    }: SliderSizesProps) {
    const [tempValue, setTempValue] = React.useState<number[]>(value);

    // sync local tempValue when parent changes
    React.useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleChange = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setTempValue(newValue);
        }
    };

    const handleChangeCommitted = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            onFinalChange(newValue);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Slider
                value={tempValue}
                min={min}
                max={max}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
                valueLabelDisplay="auto"
                getAriaLabel={() => "Price range"}
                getAriaValueText={valuetext}
            />
        </Box>
    );
}
