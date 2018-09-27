import builtins as _mod_builtins
import msgpack as _mod_msgpack
import msgpack.exceptions as _mod_msgpack_exceptions

BufferFull = _mod_msgpack_exceptions.BufferFull
ExtType = _mod_msgpack.ExtType
ExtraData = _mod_msgpack_exceptions.ExtraData
OutOfData = _mod_msgpack_exceptions.OutOfData
UnpackValueError = _mod_msgpack_exceptions.UnpackValueError
class Unpacker(_mod_builtins.object):
    "Unpacker(file_like=None, Py_ssize_t read_size=0, bool use_list=True, bool raw=True, object_hook=None, object_pairs_hook=None, list_hook=None, encoding=None, unicode_errors=None, int max_buffer_size=0, ext_hook=ExtType, Py_ssize_t max_str_len=2147483647, Py_ssize_t max_bin_len=2147483647, Py_ssize_t max_array_len=2147483647, Py_ssize_t max_map_len=2147483647, Py_ssize_t max_ext_len=2147483647)\nStreaming unpacker.\n\n    arguments:\n\n    :param file_like:\n        File-like object having `.read(n)` method.\n        If specified, unpacker reads serialized data from it and :meth:`feed()` is not usable.\n\n    :param int read_size:\n        Used as `file_like.read(read_size)`. (default: `min(1024**2, max_buffer_size)`)\n\n    :param bool use_list:\n        If true, unpack msgpack array to Python list.\n        Otherwise, unpack to Python tuple. (default: True)\n\n    :param bool raw:\n        If true, unpack msgpack raw to Python bytes (default).\n        Otherwise, unpack to Python str (or unicode on Python 2) by decoding\n        with UTF-8 encoding (recommended).\n        Currently, the default is true, but it will be changed to false in\n        near future.  So you must specify it explicitly for keeping backward\n        compatibility.\n\n        *encoding* option which is deprecated overrides this option.\n\n    :param callable object_hook:\n        When specified, it should be callable.\n        Unpacker calls it with a dict argument after unpacking msgpack map.\n        (See also simplejson)\n\n    :param callable object_pairs_hook:\n        When specified, it should be callable.\n        Unpacker calls it with a list of key-value pairs after unpacking msgpack map.\n        (See also simplejson)\n\n    :param int max_buffer_size:\n        Limits size of data waiting unpacked.  0 means system's INT_MAX (default).\n        Raises `BufferFull` exception when it is insufficient.\n        You should set this parameter when unpacking data from untrusted source.\n\n    :param int max_str_len:\n        Limits max length of str. (default: 2**31-1)\n\n    :param int max_bin_len:\n        Limits max length of bin. (default: 2**31-1)\n\n    :param int max_array_len:\n        Limits max length of array. (default: 2**31-1)\n\n    :param int max_map_len:\n        Limits max length of map. (default: 2**31-1)\n\n    :param str encoding:\n        Deprecated, use raw instead.\n        Encoding used for decoding msgpack raw.\n        If it is None (default), msgpack raw is deserialized to Python bytes.\n\n    :param str unicode_errors:\n        Error handler used for decoding str type.  (default: `'strict'`)\n\n\n    Example of streaming deserialize from file-like object::\n\n        unpacker = Unpacker(file_like, raw=False)\n        for o in unpacker:\n            process(o)\n\n    Example of streaming deserialize from socket::\n\n        unpacker = Unpacker(raw=False)\n        while True:\n            buf = sock.recv(1024**2)\n            if not buf:\n                break\n            unpacker.feed(buf)\n            for o in unpacker:\n                process(o)\n    "
    __class__ = Unpacker
    def __init__(self, file_like=None, Py_ssize_tread_size=0, booluse_list=True, boolraw=True, object_hook=None, object_pairs_hook=None, list_hook=None, encoding=None, unicode_errors=None, intmax_buffer_size=0, ext_hook=ExtType, Py_ssize_tmax_str_len=2147483647, Py_ssize_tmax_bin_len=2147483647, Py_ssize_tmax_array_len=2147483647, Py_ssize_tmax_map_len=2147483647, Py_ssize_tmax_ext_len=2147483647):
        "Unpacker(file_like=None, Py_ssize_t read_size=0, bool use_list=True, bool raw=True, object_hook=None, object_pairs_hook=None, list_hook=None, encoding=None, unicode_errors=None, int max_buffer_size=0, ext_hook=ExtType, Py_ssize_t max_str_len=2147483647, Py_ssize_t max_bin_len=2147483647, Py_ssize_t max_array_len=2147483647, Py_ssize_t max_map_len=2147483647, Py_ssize_t max_ext_len=2147483647)\nStreaming unpacker.\n\n    arguments:\n\n    :param file_like:\n        File-like object having `.read(n)` method.\n        If specified, unpacker reads serialized data from it and :meth:`feed()` is not usable.\n\n    :param int read_size:\n        Used as `file_like.read(read_size)`. (default: `min(1024**2, max_buffer_size)`)\n\n    :param bool use_list:\n        If true, unpack msgpack array to Python list.\n        Otherwise, unpack to Python tuple. (default: True)\n\n    :param bool raw:\n        If true, unpack msgpack raw to Python bytes (default).\n        Otherwise, unpack to Python str (or unicode on Python 2) by decoding\n        with UTF-8 encoding (recommended).\n        Currently, the default is true, but it will be changed to false in\n        near future.  So you must specify it explicitly for keeping backward\n        compatibility.\n\n        *encoding* option which is deprecated overrides this option.\n\n    :param callable object_hook:\n        When specified, it should be callable.\n        Unpacker calls it with a dict argument after unpacking msgpack map.\n        (See also simplejson)\n\n    :param callable object_pairs_hook:\n        When specified, it should be callable.\n        Unpacker calls it with a list of key-value pairs after unpacking msgpack map.\n        (See also simplejson)\n\n    :param int max_buffer_size:\n        Limits size of data waiting unpacked.  0 means system's INT_MAX (default).\n        Raises `BufferFull` exception when it is insufficient.\n        You should set this parameter when unpacking data from untrusted source.\n\n    :param int max_str_len:\n        Limits max length of str. (default: 2**31-1)\n\n    :param int max_bin_len:\n        Limits max length of bin. (default: 2**31-1)\n\n    :param int max_array_len:\n        Limits max length of array. (default: 2**31-1)\n\n    :param int max_map_len:\n        Limits max length of map. (default: 2**31-1)\n\n    :param str encoding:\n        Deprecated, use raw instead.\n        Encoding used for decoding msgpack raw.\n        If it is None (default), msgpack raw is deserialized to Python bytes.\n\n    :param str unicode_errors:\n        Error handler used for decoding str type.  (default: `'strict'`)\n\n\n    Example of streaming deserialize from file-like object::\n\n        unpacker = Unpacker(file_like, raw=False)\n        for o in unpacker:\n            process(o)\n\n    Example of streaming deserialize from socket::\n\n        unpacker = Unpacker(raw=False)\n        while True:\n            buf = sock.recv(1024**2)\n            if not buf:\n                break\n            unpacker.feed(buf)\n            for o in unpacker:\n                process(o)\n    "
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __iter__(self):
        'Implement iter(self).'
        return Unpacker()

    def __next__(self):
        pass

    __pyx_vtable__ = _mod_builtins.PyCapsule()
    def __reduce__(self):
        'Unpacker.__reduce_cython__(self)'
        return ''; return ()

    def __setstate__(self, state):
        'Unpacker.__setstate_cython__(self, __pyx_state)'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    def feed(self):
        'Unpacker.feed(self, next_bytes)\nAppend `next_bytes` to internal buffer.'
        pass

    def read_array_header(self):
        'Unpacker.read_array_header(self, write_bytes=None)\nassuming the next object is an array, return its size n, such that\n        the next n unpack() calls will iterate over its contents.\n\n        Raises `OutOfData` when there are no more bytes to unpack.\n        '
        pass

    def read_bytes(self):
        'Unpacker.read_bytes(self, Py_ssize_t nbytes)\nRead a specified number of raw bytes from the stream'
        pass

    def read_map_header(self):
        'Unpacker.read_map_header(self, write_bytes=None)\nassuming the next object is a map, return its size n, such that the\n        next n * 2 unpack() calls will iterate over its key-value pairs.\n\n        Raises `OutOfData` when there are no more bytes to unpack.\n        '
        pass

    def skip(self):
        'Unpacker.skip(self, write_bytes=None)\nRead and ignore one object, returning None\n\n        If write_bytes is not None, it will be called with parts of the raw\n        message as it is unpacked.\n\n        Raises `OutOfData` when there are no more bytes to unpack.\n        '
        pass

    def tell(self):
        'Unpacker.tell(self)'
        pass

    def unpack(self):
        'Unpacker.unpack(self, write_bytes=None)\nUnpack one object\n\n        If write_bytes is not None, it will be called with parts of the raw\n        message as it is unpacked.\n\n        Raises `OutOfData` when there are no more bytes to unpack.\n        '
        pass


__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/msgpack/_unpacker.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'msgpack._unpacker'
__package__ = 'msgpack'
__test__ = _mod_builtins.dict()
def default_read_extended_type(typecode, data):
    'default_read_extended_type(typecode, data)'
    pass

def unpack(stream, **kwargs):
    'unpack(stream, **kwargs)'
    pass

def unpackb(packed, object_hook=None, list_hook=None, booluse_list=True, boolraw=True, encoding=None, unicode_errors=None, object_pairs_hook=None, ext_hook=ExtType, Py_ssize_tmax_str_len=2147483647, Py_ssize_tmax_bin_len=2147483647, Py_ssize_tmax_array_len=2147483647, Py_ssize_tmax_map_len=2147483647, Py_ssize_tmax_ext_len=2147483647):
    'unpackb(packed, object_hook=None, list_hook=None, bool use_list=True, bool raw=True, encoding=None, unicode_errors=None, object_pairs_hook=None, ext_hook=ExtType, Py_ssize_t max_str_len=2147483647, Py_ssize_t max_bin_len=2147483647, Py_ssize_t max_array_len=2147483647, Py_ssize_t max_map_len=2147483647, Py_ssize_t max_ext_len=2147483647)\n\n    Unpack packed_bytes to object. Returns an unpacked object.\n\n    Raises `ValueError` when `packed` contains extra bytes.\n\n    See :class:`Unpacker` for options.\n    '
    pass

