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
    def __init__(self, filter_name, initial=None, data=None, queryset=None,
                 prefix=None, strict=None):
        self.initial = initial or {}
        self.filter_name = filter_name
        BaseFilterSet.__init__(self, data, queryset, prefix, strict)
        for l in list(self.form.fields):
            new_label = parse_to_label(l)
            self.form.fields[l].label = new_label


def _wrap_filter_in_group(line):
    return '<div class="ff-group">' + line + '</div>'


def parse_to_label(value):
    parts = value.split("__")
    if len(parts) > 1:
        parts[-1] = parse_suffix(parts[-1])
    parts = [
        ' '.join(p for p in part.split('_') if p)
        for part in parts
    ]
    value = ' '.join(part for part in parts if part)
    return value.capitalize()


def parse_suffix(word):
    lookup_types = {
        'iexact': '(case insensitive)',
        'lt': 'less than',
        'gt': 'greater than',
        'gte': 'greater than or equal to',
        'lte': 'less than or equal to',
        'startswith': 'starts with',
        'endswith': 'ends with',
        'contains': 'contains',
        'not_contains': 'does not contain'
    }
    return lookup_types.get(word, word)


@python_2_unicode_compatible
class FilterForm(six.with_metaclass(FilterFormMetaclass, BaseFilterForm)):
    """Declare filters.

    FilterForm can be used to store filters, render them as HTML and apply
    to queryset given data provided by the HTML form.

    Wrapper for django-filter. See django-filter documentation for detailed
    usage.
    """
    def filter_queryset(self, filter_data=None, queryset=None):
        """Return filtered queryset given original queryset and form data
        represented as Django QueryDict.
        """
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
        """Apply filters to the queryset given form data represented as
        urlencoded string. This is the way how it is sent by the browser in POST
        request.
        """
        querydict = QueryDict(query_string)
        return self.filter_queryset(querydict, queryset)

    def __str__(self):
        """Render filters as HTML."""
        row_html = '%(label)s %(field)s'
        form_str = self.form._html_output(
            normal_row=_wrap_filter_in_group(row_html),
            error_row='%s',
            row_ender='',
            help_text_html='%s',
            errors_on_separate_row=True)

        context = {
            'name': self.filter_name,
            'form_str': form_str,
        }
        text = render_to_string('django_querybuilder/filterform_template.html',
                                context)
        return text
