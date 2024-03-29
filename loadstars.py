import argparse
import ctypes
import numpy as np
import pandas as pd


class Header(ctypes.LittleEndianStructure):
    _pack_ = 1
    _fields_ = [
        ("tag", ctypes.c_char * 8),
        ("version", ctypes.c_uint16),
        ("len", ctypes.c_uint32),
    ]


def load_stars(*, path: str) -> pd.DataFrame:
    with open(path, "rb") as input_stream:
        header = Header()
        input_stream.readinto(header)
        assert header.version == 0x100
        content = input_stream.read()
    data = np.frombuffer(
        content,
        dtype=[
            ("id", "<u4"),
            ("x", "<f4"),
            ("y", "<f4"),
            ("z", "<f4"),
            ("mag", "<i2"),
            ("sl", "u1"),
            ("kt", "u1"),
        ],
    )
    assert header.len == data.shape[0]
    frame = pd.DataFrame(columns=data.dtype.names, data=data)
    frame["mag"] /= 256
    frame["kind"] = frame["kt"] // 16
    frame["type"] = frame["kt"] % 16
    frame["sub"] = frame["sl"] // 16
    frame["lum"] = frame["sl"] % 16
    frame.drop(columns=["sl", "kt"], inplace=True)
    return frame


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    run(**args.__dict__)


def run(*, input: str, output: str):
    stars = load_stars(path=input)
    print(stars)
    print(stars.dtypes)
    stars.to_csv(index=None, path_or_buf=output)


if __name__ == "__main__":
    main()
