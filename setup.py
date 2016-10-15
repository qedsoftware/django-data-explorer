import os
from setuptools import find_packages, setup

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()

os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

version = '0.0.5'

setup(
    name='django-data-explorer',
    version=version,
    description='AJAX tables and maps made simple',
    long_description=README,
    author='Quantitative Engineering Design Inc.',
    author_email='djangoqb@qed.ai',
    url='http://github.com/qedsoftware/django-data-explorer',
    packages=find_packages(exclude=['tests', 'example']),
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Framework :: Django',
    ],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "django>=1.8.0",
        "django-filter>=0.10.0",
        "django-jenkins"
    ]
)
