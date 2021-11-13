from logging.config import fileConfig

from alembic import context

from common.steam_database.config import get_steam_db_connection_config
from common.steam_database.db import Base, engine

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config
db_connection_string = get_steam_db_connection_config().connection_string
config.set_main_option("sqlalchemy.url", db_connection_string)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline():
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url,
                      target_metadata=target_metadata,
                      literal_binds=True,
                      dialect_opts={"paramstyle": "named"})

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

# from alembic.config import Config
# from alembic import command, autogenerate
# from alembic.script import ScriptDirectory
# from alembic.runtime.environment import EnvironmentContext
# from alembic.runtime.migration import MigrationContext
# from alembic.operations import Operations


# # def run_migrations(engine, target_metadata, path_to_migrations):
# #     """
# #     Run migrations in 'online' mode.

# #     In this scenario we need to create an Engine
# #     and associate a connection with the context.
# #     """
# #     alembic_cfg = Config()
# #     alembic_cfg.set_main_option("script_location", path_to_migrations)
# #     alembic_cfg.set_main_option("sqlalchemy.url", str(engine.url))
# #     alembic_script = ScriptDirectory.from_config(alembic_cfg)
# #     alembic_env = EnvironmentContext(alembic_cfg, alembic_script)

# #     def do_upgrade(revision, context):
# #         return alembic_script._upgrade_revs(alembic_script.get_heads(), revision)

# #     with engine.connect() as connection:
# #         alembic_env.configure(connection=connection,
# #                               target_metadata=target_metadata,
# #                               fn=do_upgrade)
# #         alembic_context = alembic_env.get_context()
# #         with alembic_context.begin_transaction():
# #             alembic_context.run_migrations()


# def run_migrations(engine, target_metadata, path_to_migrations):
#     alembic_cfg = Config()
#     alembic_cfg.set_main_option("script_location", path_to_migrations)
#     alembic_cfg.set_main_option("sqlalchemy.url", str(engine.url))
#     alembic_script = ScriptDirectory.from_config(alembic_cfg)

#     def do_upgrade(revision, context):
#         return alembic_script._upgrade_revs(alembic_script.get_heads(), revision)

#     with engine.connect() as connection:
#         context = MigrationContext.configure(connection,
#                                              target_metadata,
#                                              opts={"fn": do_upgrade})
#         globals()["alembic_context"] = context
#         print(globals()["alembic_context"])
#         with context.begin_transaction():
#             context.run_migrations()
#         globals().pop("alembic_context")
