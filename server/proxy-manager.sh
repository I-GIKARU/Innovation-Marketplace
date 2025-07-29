#!/bin/bash

# Cloud SQL Proxy Manager for Innovation Marketplace
# Usage: ./proxy-manager.sh [start|stop|status|restart]

PROXY_LOG="proxy.log"
INSTANCE_NAME="projects-9edde:us-central1:innovation-marketplace-db"
SOCKET_DIR="/cloudsql"

case "$1" in
    start)
        echo "🚀 Starting Cloud SQL Proxy..."
        
        # Check if proxy is already running
        if pgrep -f "cloud_sql_proxy.*$INSTANCE_NAME" > /dev/null; then
            echo "⚠️  Cloud SQL Proxy is already running!"
            exit 1
        fi
        
        # Create socket directory if it doesn't exist
        if [ ! -d "$SOCKET_DIR" ]; then
            echo "📁 Creating socket directory..."
            sudo mkdir -p "$SOCKET_DIR"
            sudo chmod 777 "$SOCKET_DIR"
        fi
        
        # Start the proxy
        nohup cloud_sql_proxy -dir="$SOCKET_DIR" -instances="$INSTANCE_NAME" > "$PROXY_LOG" 2>&1 &
        
        # Wait a moment and check if it started successfully
        sleep 3
        if pgrep -f "cloud_sql_proxy.*$INSTANCE_NAME" > /dev/null; then
            echo "✅ Cloud SQL Proxy started successfully!"
            echo "📄 Logs: tail -f $PROXY_LOG"
        else
            echo "❌ Failed to start Cloud SQL Proxy. Check logs: cat $PROXY_LOG"
            exit 1
        fi
        ;;
        
    stop)
        echo "🛑 Stopping Cloud SQL Proxy..."
        PID=$(pgrep -f "cloud_sql_proxy.*$INSTANCE_NAME")
        if [ -n "$PID" ]; then
            kill "$PID"
            echo "✅ Cloud SQL Proxy stopped (PID: $PID)"
        else
            echo "⚠️  Cloud SQL Proxy is not running"
        fi
        ;;
        
    status)
        echo "🔍 Checking Cloud SQL Proxy status..."
        PID=$(pgrep -f "cloud_sql_proxy.*$INSTANCE_NAME")
        if [ -n "$PID" ]; then
            echo "✅ Cloud SQL Proxy is running (PID: $PID)"
            echo "📁 Socket: $SOCKET_DIR/$INSTANCE_NAME/.s.PGSQL.5432"
            if [ -S "$SOCKET_DIR/$INSTANCE_NAME/.s.PGSQL.5432" ]; then
                echo "🔌 Socket file exists - connection ready!"
            else
                echo "⚠️  Socket file not found - proxy may still be starting"
            fi
        else
            echo "❌ Cloud SQL Proxy is not running"
        fi
        ;;
        
    restart)
        echo "🔄 Restarting Cloud SQL Proxy..."
        $0 stop
        sleep 2
        $0 start
        ;;
        
    logs)
        echo "📄 Showing proxy logs..."
        if [ -f "$PROXY_LOG" ]; then
            tail -f "$PROXY_LOG"
        else
            echo "❌ Log file not found: $PROXY_LOG"
        fi
        ;;
        
    *)
        echo "Usage: $0 {start|stop|status|restart|logs}"
        echo ""
        echo "Commands:"
        echo "  start    - Start the Cloud SQL Proxy"
        echo "  stop     - Stop the Cloud SQL Proxy"
        echo "  status   - Check if proxy is running"
        echo "  restart  - Restart the proxy"
        echo "  logs     - Show proxy logs (live tail)"
        echo ""
        echo "Instance: $INSTANCE_NAME"
        echo "Socket Directory: $SOCKET_DIR"
        exit 1
        ;;
esac
