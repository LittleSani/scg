
import torch
import torch.nn as nn
import torch.nn.functional as F

class GCNLayer(nn.Module):
    def __init__(self, in_features, out_features):
        super(GCNLayer, self).__init__()
        self.linear = nn.Linear(in_features, out_features)

    def forward(self, adj_matrix, node_features):
        # This is a simplified GCN layer
        # In a real implementation, you would have a more complex aggregation function
        support = self.linear(node_features)
        output = torch.sparse.mm(adj_matrix, support)
        return output

class GNN(nn.Module):
    def __init__(self, n_features, n_hidden, n_classes, dropout):
        super(GNN, self).__init__()
        self.gc1 = GCNLayer(n_features, n_hidden)
        self.gc2 = GCNLayer(n_hidden, n_classes)
        self.dropout = dropout

    def forward(self, adj_matrix, node_features):
        x = F.relu(self.gc1(adj_matrix, node_features))
        x = F.dropout(x, self.dropout, training=self.training)
        x = self.gc2(adj_matrix, x)
        return F.log_softmax(x, dim=1)
