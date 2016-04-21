import abc


class Widget(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_data(self, query_config):
        """
        Returns filtered data.
        List of dictionaries with results' attributes.
        """
        return

    @abc.abstractmethod
    def __str__(self):
        """
        Returns rendered widget.
        """
        return
