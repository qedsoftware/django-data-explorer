"""Querybuilder Django package.

This package facilitates creating AJAX driven tables and maps with filtering.

You can see example usage in directory examples.

Basic usage is to create dedicated file querybuilder.py in your app directory,
subclass QuerybuilderEndpoint (and set field name) and add it to urls.py under
the same name.

Then you can add widgets to the view. Simply create objects of class MetaMap
and MetaTable and register them in the endpoint (endpoint's method register).

Afterwards, you can use the widgets with endpoint.get_widget(widget_name,
params) and render it in the view.

For most basic usage params will be an empty dictionary, but whatever you put
there, it will be passed to widget's get_data function.

Params can be used to pass additional parameters to get_data function, which
you can override to subselect the dataset.
"""


from django_querybuilder.filterform import FilterForm
from django_querybuilder.endpoint import QuerybuilderEndpoint
from django_querybuilder.map import MetaMap
from django_querybuilder.table import MetaTable

__all__ = ['FilterForm', 'QuerybuilderEndpoint', 'MetaMap', 'MetaTable']
