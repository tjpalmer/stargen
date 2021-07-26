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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input")
    args = parser.parse_args()
    run(**args.__dict__)


def run(*, input: str):
    with open(input, "rb") as input_stream:
        header = Header()
        input_stream.readinto(header)
        assert header.version == 0x100
        content = input_stream.read()
    data = np.frombuffer(content, dtype=[
        ("id", "<u4"),
        ("x", "<f4"),
        ("y", "<f4"),
        ("z", "<f4"),
        ("mag", "<i2"),
        ("class", "<u2"),
    ])
    assert header.len == data.shape[0]
    frame = pd.DataFrame(columns=data.dtype.names, data=data)
    print(frame)


if __name__ == "__main__":
    main()
