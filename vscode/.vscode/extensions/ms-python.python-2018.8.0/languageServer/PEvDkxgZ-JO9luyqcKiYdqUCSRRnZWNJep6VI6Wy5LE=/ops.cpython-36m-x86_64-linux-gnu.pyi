import builtins as _mod_builtins
import collections.abc as _mod_collections_abc

class CupyOps(Ops):
    __class__ = CupyOps
    __dict__ = {}
    def __init__(self, xp):
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    def adam(self, weights, gradient, mom1, mom2, beta1, beta2, eps, learn_rate, mod_rate):
        pass

    def asarray(self, X, dtype):
        pass

    def backprop_max_pool(self, d_maxes, which, lengths):
        pass

    def backprop_maxout(self, dX__bo, which__bo, P):
        pass

    def backprop_mean_pool(self, d_means, lengths):
        pass

    def backprop_relu(self, delta_, signal_out, inplace):
        pass

    def backprop_selu(self, delta, signal_in, inplace):
        pass

    def backprop_seq2col(self, dY, nW):
        pass

    def backprop_sum_pool(self, d_sums, lengths):
        pass

    def clip_gradient(self, gradient, threshold):
        pass

    device = 'gpu'
    def hash(self, ids, seed):
        pass

    def max_pool(self, X, lengths):
        pass

    def maxout(self, X):
        pass

    def mean_pool(self, X, lengths):
        pass

    def normal_init(self, W, fan_in, inplace):
        pass

    def relu(self, X, inplace):
        pass

    def scatter_add(self, out, ids, inputs):
        pass

    def selu(self, X, inplace):
        pass

    def seq2col(self, seq, nW):
        'Given an (M, N) sequence of vectors, return an (M, N*(nW*2+1)) sequence.\n        The new sequence is constructed by concatenating nW preceding and succeeding\n        vectors onto each column in the sequence, to extract a window of features.\n        '
        pass

    def sum_pool(self, X, lengths):
        pass


class NumpyOps(Ops):
    __class__ = NumpyOps
    __dict__ = {}
    def __init__(self, xp):
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    def adam(self, weights, gradient, mom1, mom2, beta1, beta2, eps, learn_rate, mod_rate):
        pass

    def add_sum(self, out, to_sum):
        pass

    def affine(self, weights, bias, signal):
        pass

    def backprop_elu(self, delta_, signal_out_, inplace):
        pass

    def backprop_lstm(self, d_cells, d_prev, d_gates, d_output, gates, cells, prev):
        pass

    def backprop_max_pool(self, d_maxes, which, lengths):
        pass

    def backprop_maxout(self, dX__bo, which__bo, P):
        pass

    def backprop_mean_pool(self, d_means, lengths):
        pass

    def backprop_relu(self, delta_, signal_out_, inplace):
        pass

    def backprop_selu(self, delta_, signal_in_, inplace):
        pass

    def backprop_seq2col(self, dY, nW):
        pass

    def backprop_sum_pool(self, d_sums, lengths):
        pass

    def batch_dot(self, x, y):
        pass

    def batch_outer(self, x, y):
        pass

    def dot(self, x, y):
        pass

    def elu(self, X, inplace):
        pass

    def hash(self, ids, seed):
        'Hash a sequence of 64-bit keys into a table with 4 32-bit keys'
        pass

    def increment_slices(self, contig_array, _to_add, _starts):
        pass

    def lstm(self, output, cells, gates, prev):
        pass

    def max_pool(self, X, lengths):
        pass

    def maxout(self, py_cands):
        pass

    def mean_pool(self, X, lengths):
        pass

    def ngrams(self, n, keys_):
        pass

    def relu(self, X, inplace):
        pass

    def remap_ids(self, mapping, ids_mv, value):
        pass

    def scatter_add(self, out, ids, inputs):
        pass

    def selu(self, X, inplace):
        pass

    def seq2col(self, seq, nW):
        'Given an (M, N) sequence of vectors, return an (M, N*(nW*2+1)) sequence.\n        The new sequence is constructed by concatenating nW preceding and succeeding\n        vectors onto each column in the sequence, to extract a window of features.\n        '
        pass

    def sum_pool(self, X, lengths):
        pass


class Ops(_mod_builtins.object):
    __class__ = Ops
    __dict__ = {}
    def __init__(self, xp):
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    __module__ = 'thinc.neural.ops'
    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def __weakref__(self):
        'list of weak references to the object (if defined)'
        pass

    def adam(self, weights, gradient, mom1, mom2, beta1, beta2, eps, learn_rate, mod_rate):
        pass

    def add_sum(self, out, to_sum):
        pass

    def affine(self, weights, bias, signal):
        pass

    def allocate(self, shape, dtype):
        pass

    def argmax(self, x, axis):
        pass

    def asarray(self, data, dtype):
        pass

    def backprop_softmax_sequences(self, dy, y, lengths):
        pass

    def backprop_take(self, dX__bo, which__bo, nP):
        pass

    def batch_dot(self, x, y):
        pass

    def batch_outer(self, x, y):
        pass

    def clip_gradient(self, gradient, threshold):
        pass

    def clip_low(self, x, value, inplace):
        pass

    device = 'cpu'
    def dot(self, x, y):
        pass

    def dropout(self, x, dropout, inplace):
        pass

    def dropout_sequences(self, X, dropout, inplace):
        pass

    def expand_dims(self, a, axis):
        pass

    def flatten(self, X, dtype, pad):
        pass

    def get_dropout_mask(self, shape, drop):
        pass

    def he_normal_init(self, shape, fan_in):
        pass

    def logloss(self, y_true, y_pred):
        pass

    def norm(self, x):
        pass

    def normal_init(self, W, fan_in, inplace):
        pass

    def softmax(self, x, inplace, axis):
        pass

    def softmax_sequences(self, Xs, lengths, inplace, axis):
        pass

    def sparsify(self, gradient, topk):
        pass

    def take_which(self, x, which, axis):
        pass

    def unflatten(self, X, lengths, pad):
        pass

    def unzip(self, data):
        pass

    def update_averages(self, ema, weights, t, max_decay):
        pass

    def xavier_uniform_init(self, W, inplace):
        pass

    xp = None

Sized = _mod_collections_abc.Sized
__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/thinc/neural/ops.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'thinc.neural.ops'
__package__ = 'thinc.neural'
__pyx_capi__ = _mod_builtins.dict()
def __pyx_unpickle_Enum():
    pass

__test__ = _mod_builtins.dict()
def add_gradient_noise():
    pass

def concat(seqs):
    'concat(seqs)\n\n    Concatenate zero or more iterables, any of which may be infinite.\n\n    An infinite sequence will prevent the rest of the arguments from\n    being included.\n\n    We use chain.from_iterable rather than ``chain(*seqs)`` so that seqs\n    can be a generator.\n\n    >>> list(concat([[], [1], [2, 3]]))\n    [1, 2, 3]\n\n    See also:\n        itertools.chain.from_iterable  equivalent\n    '
    pass

def copy_array(dst, src, casting, where):
    pass

def cpu_clip_gradient():
    pass

cupy = None
def get_array_module(_):
    pass

integer_types = _mod_builtins.tuple()
def prod(a, axis, dtype, out, keepdims, initial):
    '\n    Return the product of array elements over a given axis.\n\n    Parameters\n    ----------\n    a : array_like\n        Input data.\n    axis : None or int or tuple of ints, optional\n        Axis or axes along which a product is performed.  The default,\n        axis=None, will calculate the product of all the elements in the\n        input array. If axis is negative it counts from the last to the\n        first axis.\n\n        .. versionadded:: 1.7.0\n\n        If axis is a tuple of ints, a product is performed on all of the\n        axes specified in the tuple instead of a single axis or all the\n        axes as before.\n    dtype : dtype, optional\n        The type of the returned array, as well as of the accumulator in\n        which the elements are multiplied.  The dtype of `a` is used by\n        default unless `a` has an integer dtype of less precision than the\n        default platform integer.  In that case, if `a` is signed then the\n        platform integer is used while if `a` is unsigned then an unsigned\n        integer of the same precision as the platform integer is used.\n    out : ndarray, optional\n        Alternative output array in which to place the result. It must have\n        the same shape as the expected output, but the type of the output\n        values will be cast if necessary.\n    keepdims : bool, optional\n        If this is set to True, the axes which are reduced are left in the\n        result as dimensions with size one. With this option, the result\n        will broadcast correctly against the input array.\n\n        If the default value is passed, then `keepdims` will not be\n        passed through to the `prod` method of sub-classes of\n        `ndarray`, however any non-default value will be.  If the\n        sub-class\' method does not implement `keepdims` any\n        exceptions will be raised.\n    initial : scalar, optional\n        The starting value for this product. See `~numpy.ufunc.reduce` for details.\n\n        .. versionadded:: 1.15.0\n\n    Returns\n    -------\n    product_along_axis : ndarray, see `dtype` parameter above.\n        An array shaped as `a` but with the specified axis removed.\n        Returns a reference to `out` if specified.\n\n    See Also\n    --------\n    ndarray.prod : equivalent method\n    numpy.doc.ufuncs : Section "Output arguments"\n\n    Notes\n    -----\n    Arithmetic is modular when using integer types, and no error is\n    raised on overflow.  That means that, on a 32-bit platform:\n\n    >>> x = np.array([536870910, 536870910, 536870910, 536870910])\n    >>> np.prod(x)  # random\n    16\n\n    The product of an empty array is the neutral element 1:\n\n    >>> np.prod([])\n    1.0\n\n    Examples\n    --------\n    By default, calculate the product of all elements:\n\n    >>> np.prod([1.,2.])\n    2.0\n\n    Even when the input array is two-dimensional:\n\n    >>> np.prod([[1.,2.],[3.,4.]])\n    24.0\n\n    But we can also specify the axis over which to multiply:\n\n    >>> np.prod([[1.,2.],[3.,4.]], axis=1)\n    array([  2.,  12.])\n\n    If the type of `x` is unsigned, then the output type is\n    the unsigned platform integer:\n\n    >>> x = np.array([1, 2, 3], dtype=np.uint8)\n    >>> np.prod(x).dtype == np.uint\n    True\n\n    If `x` is of a signed integer type, then the output type\n    is the default platform integer:\n\n    >>> x = np.array([1, 2, 3], dtype=np.int8)\n    >>> np.prod(x).dtype == int\n    True\n\n    You can also start the product with a value other than one:\n\n    >>> np.prod([1, 2], initial=5)\n    10\n    '
    pass

