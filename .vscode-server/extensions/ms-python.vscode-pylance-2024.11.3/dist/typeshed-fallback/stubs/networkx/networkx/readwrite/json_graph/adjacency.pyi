from networkx.utils.backends import _dispatchable

@_dispatchable
def adjacency_data(G, attrs={"id": "id", "key": "key"}): ...
@_dispatchable
def adjacency_graph(data, directed: bool = False, multigraph: bool = True, attrs={"id": "id", "key": "key"}): ...