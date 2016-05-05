"""Querybuilder Django package.

This package facilitates creating AJAX driven tables and maps with filtering.

Basic usage is to subclass QuerybuilderEndpoint in urls.py, override its
querybuilder field to the Python module, where you store your widgets,
define your widgets there (Tables and Maps) and render them in template.
"""


from django_querybuilder.filterform import FilterForm
from django_querybuilder.endpoint import QuerybuilderEndpoint
from django_querybuilder.map import MetaMap
from django_querybuilder.table import MetaTable
from django_querybuilder.widget import Widget

__all__ = ['FilterForm', 'QuerybuilderEndpoint', 'MetaMap', 'MetaTable', 'Widget']
