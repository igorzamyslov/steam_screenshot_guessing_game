import os

import alembic.config

dir_path = os.path.dirname(os.path.realpath(__file__))
config_path = os.path.join(dir_path, "alembic", "alembic.ini")

if not hasattr(alembic.context, "config"):
    # Execute alembic upgrade if we're not already in alembic context
    alembic.config.main(argv=['--raiseerr', f'-c{config_path}', 'upgrade', 'head'])
