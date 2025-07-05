#!/bin/bash

# Node.js Ansible Deployment Script
# This script helps deploy the Node.js application using Ansible

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -d, --deploy     Deploy the application"
    echo "  -m, --monitor    Monitor the application"
    echo "  -c, --check      Check prerequisites"
    echo "  -h, --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --check      Check if all prerequisites are met"
    echo "  $0 --deploy     Deploy the application to all servers"
    echo "  $0 --monitor    Monitor application status"
}

# Function to check prerequisites
check_prerequisites() {
    print_color $BLUE "Checking prerequisites..."
    
    # Check if Ansible is installed
    if ! command_exists ansible; then
        print_color $RED "❌ Ansible is not installed!"
        print_color $YELLOW "Install Ansible:"
        print_color $YELLOW "  Ubuntu/Debian: sudo apt install ansible"
        print_color $YELLOW "  macOS: brew install ansible"
        print_color $YELLOW "  pip: pip install ansible"
        return 1
    else
        print_color $GREEN "✅ Ansible is installed"
        ansible --version | head -n 1
    fi
    
    # Check if Node.js is installed locally
    if ! command_exists node; then
        print_color $YELLOW "⚠️  Node.js is not installed locally (optional for local testing)"
    else
        print_color $GREEN "✅ Node.js is installed locally"
        node --version
    fi
    
    # Check if npm is installed locally
    if ! command_exists npm; then
        print_color $YELLOW "⚠️  npm is not installed locally (optional for local testing)"
    else
        print_color $GREEN "✅ npm is installed locally"
        npm --version
    fi
    
    # Check if ansible directory exists
    if [ ! -d "ansible" ]; then
        print_color $RED "❌ Ansible directory not found!"
        print_color $YELLOW "Make sure you're running this script from the project root"
        return 1
    else
        print_color $GREEN "✅ Ansible directory found"
    fi
    
    # Check if inventory file exists
    if [ ! -f "ansible/inventory.ini" ]; then
        print_color $RED "❌ Inventory file not found!"
        print_color $YELLOW "Create ansible/inventory.ini with your server details"
        return 1
    else
        print_color $GREEN "✅ Inventory file found"
    fi
    
    # Check if playbook exists
    if [ ! -f "ansible/deploy.yml" ]; then
        print_color $RED "❌ Deploy playbook not found!"
        return 1
    else
        print_color $GREEN "✅ Deploy playbook found"
    fi
    
    print_color $GREEN "✅ All prerequisites met!"
    return 0
}

# Function to deploy application
deploy_application() {
    print_color $BLUE "Starting deployment..."
    
    # Check prerequisites first
    if ! check_prerequisites; then
        print_color $RED "❌ Prerequisites not met. Aborting deployment."
        exit 1
    fi
    
    # Change to ansible directory
    cd ansible
    
    # Test connectivity
    print_color $BLUE "Testing connectivity to servers..."
    if ! ansible all -i inventory.ini -m ping; then
        print_color $RED "❌ Cannot connect to servers. Check your inventory and SSH keys."
        exit 1
    fi
    
    print_color $GREEN "✅ Connectivity test passed"
    
    # Run deployment playbook
    print_color $BLUE "Running deployment playbook..."
    ansible-playbook -i inventory.ini deploy.yml
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Deployment completed successfully!"
        print_color $YELLOW "Your application should now be running on the target servers."
        print_color $YELLOW "You can access it via the server's IP address or domain name."
    else
        print_color $RED "❌ Deployment failed!"
        exit 1
    fi
}

# Function to monitor application
monitor_application() {
    print_color $BLUE "Monitoring application..."
    
    # Change to ansible directory
    cd ansible
    
    # Run monitoring playbook
    ansible-playbook -i inventory.ini monitor.yml
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Monitoring completed!"
    else
        print_color $RED "❌ Monitoring failed!"
        exit 1
    fi
}

# Main script logic
case "${1:-}" in
    -d|--deploy)
        deploy_application
        ;;
    -m|--monitor)
        monitor_application
        ;;
    -c|--check)
        check_prerequisites
        ;;
    -h|--help)
        show_usage
        ;;
    "")
        print_color $YELLOW "No option provided. Use -h for help."
        show_usage
        ;;
    *)
        print_color $RED "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac
