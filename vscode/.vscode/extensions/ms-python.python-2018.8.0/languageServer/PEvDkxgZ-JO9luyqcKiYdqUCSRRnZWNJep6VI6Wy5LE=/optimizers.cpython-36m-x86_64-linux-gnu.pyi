import builtins as _mod_builtins
import collections as _mod_collections
import thinc.neural.ops as _mod_thinc_neural_ops

def Adam():
    pass

CupyOps = _mod_thinc_neural_ops.CupyOps
NumpyOps = _mod_thinc_neural_ops.NumpyOps
class Optimizer(_mod_builtins.object):
    'Do various flavours of stochastic gradient descent, with first and\n    second order momentum.\n    \n    Examples\n    \n    * beta1=0., beta2=0.: "vanilla" SGD\n    * beta1=0.9, beta2=0.: "Classic momentum"\n    * beta1=0.0, beta2=0.2: RMS prop\n    * b1=0.999, b2=0.9: Adam\n    '
    def __call__(self, weights, gradient, lr_scale, key):
        pass

    __class__ = Optimizer
    __dict__ = {}
    def __init__(self, ops, lr, L2, beta1, beta2, eps, decay, b1_decay, b2_decay, max_grad_norm, gradient_noise, nesterov):
        'Do various flavours of stochastic gradient descent, with first and\n    second order momentum.\n    \n    Examples\n    \n    * beta1=0., beta2=0.: "vanilla" SGD\n    * beta1=0.9, beta2=0.: "Classic momentum"\n    * beta1=0.0, beta2=0.2: RMS prop\n    * b1=0.999, b2=0.9: Adam\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    __module__ = 'thinc.neural.optimizers'
    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def __weakref__(self):
        'list of weak references to the object (if defined)'
        pass

    def _adam(self, xp, weights, gradient, lr_scale, key, nr_upd):
        pass

    def _nesterov(self, xp, weights, gradient, lr_scale, key):
        pass

    def lr(self, nr_upd):
        pass

    def to_cpu(self):
        pass

    def to_gpu(self):
        pass


def SGD():
    pass

__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/thinc/neural/optimizers.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'thinc.neural.optimizers'
__package__ = 'thinc.neural'
__test__ = _mod_builtins.dict()
def add_gradient_noise():
    pass

defaultdict = _mod_collections.defaultdict
def get_array_module(_):
    pass

def linear_decay():
    pass

