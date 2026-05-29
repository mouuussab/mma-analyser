# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

def run_app():
    """Launch the RIVUS Flask application."""
    # Import app only when actually running to avoid heavy imports at package load
    from rivus_ai.app import run_app as _run_app
    return _run_app()

__all__ = [
    "run_app",
]