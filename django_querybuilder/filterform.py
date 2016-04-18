from django.http import QueryDict
from django.template.loader import render_to_string
from django.utils import six
from django.utils.six import python_2_unicode_compatible
from django_filters.filterset import (BaseFilterSet, get_declared_filters,
                                      FilterSetOptions, filters_for_model)


class FilterFormMetaclass(type):
    def __new__(mcs, name, bases, attrs):
        try:
            parents = [b for b in bases if issubclass(b, FilterForm)]
        except NameError:
            parents = None
        declared_filters = get_declared_filters(bases, attrs, False)
        new_class = super(
            FilterFormMetaclass, mcs).__new__(mcs, name, bases, attrs)

        if not parents:
            return new_class

        opts = new_class._meta = FilterSetOptions(
            getattr(new_class, 'Meta', None))
        if opts.model:
            filters = filters_for_model(opts.model, opts.fields, opts.exclude,
                                        new_class.filter_for_field,
                                        new_class.filter_for_reverse_field)
            filters.update(declared_filters)
        else:
            filters = declared_filters

        not_defined = next((k for k, v in filters.items() if v is None), False)
        if not_defined:
            raise TypeError("Meta.fields contains a field that isn't defined "
                            "on this FilterForm: {}".format(not_defined))

        new_class.declared_filters = declared_filters
        new_class.base_filters = filters
        return new_class


class BaseFilterForm(BaseFilterSet):
    def __init__(self, initial=None, data=None, queryset=None, prefix=None,
                 strict=None):
        self.initial = initial or {}
        BaseFilterSet.__init__(self, data, queryset, prefix, strict)


@python_2_unicode_compatible
class FilterForm(six.with_metaclass(FilterFormMetaclass, BaseFilterForm)):
    def filter_queryset(self, filter_data=None, queryset=None):
        if filter_data is None or filter_data == {}:
            filter_data = self.initial
        kwargs = {}
        for key, _ in filter_data.items():
            if filter_data[key]:
                kwargs[key] = filter_data[key]

        if queryset is None:
            result = None
        else:
            result = queryset.filter(**kwargs)

        return result

    def filter_queryset_query_string(self, query_string, queryset):
        querydict = QueryDict(query_string)
        return self.filter_queryset(querydict, queryset)

    def __str__(self):
        context = {
            'name': 'filterform',
            'filter': self.filters,
        }
        text = render_to_string('django_querybuilder/filterform_template.html',
                                context)
        return text
