import argparse
import ctypes


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
        print(header.version)
        print(header.len)
        rest = input_stream.read()
        print(len(rest) / 20)
        print(rest.__class__)


if __name__ == "__main__":
    main()
