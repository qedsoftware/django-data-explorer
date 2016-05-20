"""Querybuilder Django package.

Recommended usage is to create dedicated file querybuilder.py in your app
directory, subclass QuerybuilderEndpoint (and set field name) and add it to
urls.py under the same name.

Then you can add widgets to the view. Simply create classes for your widgets
by inheriting from Map or Table and register them in the endpoint
(endpoint's method register, which can also be used as a decorator).

Afterwards, you can use the widgets with endpoint.get_widget(widget_name,
params) and render it in the view.

For most basic usage params will be an empty dictionary, but whatever you put
there, it will be always available in your widget object and also in its
JavaScript counterparts. For example, you can use params when overriding
get_data method to subselect the dataset.
"""


from django_querybuilder.filterform import FilterForm
from django_querybuilder.endpoint import QuerybuilderEndpoint
from django_querybuilder.map import Map
from django_querybuilder.table import Table

__all__ = ['FilterForm', 'QuerybuilderEndpoint', 'Map', 'Table']
