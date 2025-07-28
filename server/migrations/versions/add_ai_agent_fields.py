"""Add AI agent CV and project summary fields

Revision ID: ai_agent_fields_001
Revises: fcdfd60546b7
Create Date: 2025-01-26 20:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'ai_agent_fields_001'
down_revision = 'fcdfd60546b7'
branch_labels = None
depends_on = None


def upgrade():
    # Add AI-related fields to users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('cv_url', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('cv_summary', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('cv_file_id', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('cv_uploaded_at', sa.DateTime(), nullable=True))

    # Add AI-related fields to projects table
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.add_column(sa.Column('project_summary', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('documentation_file_id', sa.String(length=100), nullable=True))


def downgrade():
    # Remove AI-related fields from projects table
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.drop_column('documentation_file_id')
        batch_op.drop_column('project_summary')

    # Remove AI-related fields from users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('cv_uploaded_at')
        batch_op.drop_column('cv_file_id')
        batch_op.drop_column('cv_summary')
        batch_op.drop_column('cv_url')
