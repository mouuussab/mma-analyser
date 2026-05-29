from rivus_ai.data_loader.external_data_loader import ExternalDataLoader
from rivus_ai.data_loader.mysql_data_loader import MySQLDataLoader
from rivus_ai.data_loader.mssql_data_loader import MSSQLDataLoader
from rivus_ai.data_loader.kusto_data_loader import KustoDataLoader
from rivus_ai.data_loader.s3_data_loader import S3DataLoader
from rivus_ai.data_loader.azure_blob_data_loader import AzureBlobDataLoader
from rivus_ai.data_loader.postgresql_data_loader import PostgreSQLDataLoader
from rivus_ai.data_loader.mongodb_data_loader import MongoDBDataLoader
from rivus_ai.data_loader.bigquery_data_loader import BigQueryDataLoader
from rivus_ai.data_loader.athena_data_loader import AthenaDataLoader

DATA_LOADERS = {
    "mysql": MySQLDataLoader,
    "mssql": MSSQLDataLoader,
    "kusto": KustoDataLoader,
    "s3": S3DataLoader,
    "azure_blob": AzureBlobDataLoader,
    "postgresql": PostgreSQLDataLoader,
    "mongodb": MongoDBDataLoader,
    "bigquery": BigQueryDataLoader,
    "athena": AthenaDataLoader
}

__all__ = [
    "ExternalDataLoader", 
    "MySQLDataLoader", 
    "MSSQLDataLoader", 
    "KustoDataLoader", 
    "S3DataLoader", 
    "AzureBlobDataLoader", 
    "PostgreSQLDataLoader", 
    "MongoDBDataLoader", 
    "BigQueryDataLoader",
    "AthenaDataLoader", 
    "DATA_LOADERS"]