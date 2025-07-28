"""Remove M-Pesa fields from sales table

Revision ID: remove_mpesa_fields
Revises: 
Create Date: 2025-01-27 18:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'remove_mpesa_fields'
down_revision = 'cb4630d3d223'
branch_labels = None
depends_on = None


def upgrade():
    # Remove M-Pesa related columns from sales table
    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.drop_column('checkout_request_id')
        batch_op.drop_column('mpesa_transaction_id')
        batch_op.drop_column('mpesa_amount')
        batch_op.drop_column('mpesa_phone')


def downgrade():
    # Add back M-Pesa related columns to sales table
    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.add_column(sa.Column('checkout_request_id', sa.String(255), nullable=True))
        batch_op.add_column(sa.Column('mpesa_transaction_id', sa.String(255), nullable=True))
        batch_op.add_column(sa.Column('mpesa_amount', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('mpesa_phone', sa.String(20), nullable=True))
