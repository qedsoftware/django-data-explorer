#!/usr/bin/env python

from __future__ import print_function
from __future__ import unicode_literals

import os
import subprocess
import sys


def do_call(args):
    oneline = ['"{}"'.format(x) for x in args]
    oneline = ' '.join(oneline)
    print('[{}]> {}'.format(os.getcwd(), oneline))
    try:
        subprocess.check_call(args, env=os.environ)
    except subprocess.CalledProcessError as error:
        print(error)
        print(error.output)
        sys.exit(1)


def run_django_unittests():
    os.chdir('example')
    do_call(['./manage.py', 'jenkins'])
    os.chdir('..')


def run_unittests():
    print('Running unittests')
    run_django_unittests()
    do_call(['which', 'npm'])
    do_call(['npm', 'install'])
    do_call(['npm', 'run', 'deps'])
    do_call(['npm', 'test'])


if __name__ == "__main__":
    run_unittests()
