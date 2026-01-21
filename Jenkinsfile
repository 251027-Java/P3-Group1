pipeline {
    agent any

    parameters {
        string(
            name: 'BRANCH',
            defaultValue: '',
            description: 'Branch to build'
        )
    }

    environment {
        // Map service names to Jenkins job names
        EUREKA_SERVER_JOB = 'eureka-server'
        API_GATEWAY_JOB = 'api-gateway'
        ANGULAR_SERVICE_JOB = 'angular-spring-backend'
        REACT_SERVICE_JOB = 'react-spring-backend'
        ANGULAR_MFE_JOB = 'angular-mfe'
        REACT_MFE_JOB = 'react-mfe'
        SHELL_JOB = 'shell'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    if (params.BRANCH?.trim()) {
                        env.TARGET_BRANCH = params.BRANCH.trim()
                    } else {
                        env.TARGET_BRANCH = env.GIT_BRANCH?.replaceAll('origin/', '') ?: 'main'
                    }
                    echo "Building branch: ${env.TARGET_BRANCH}"
                }
            }
        }

        stage('Detect Changes') {
            steps {
                script {
                    def changes = []
                    
                    try {
                        changes = sh(
                            script: "git diff --name-only HEAD~1 HEAD || echo ''",
                            returnStdout: true
                        ).trim().split('\n').findAll { it }
                    } catch (Exception e) {
                        echo "Could not detect changes, building all services"
                        changes = ['backend/', 'frontend/']
                    }

                    echo "Changed files: ${changes}"

                    // Determine which services to build
                    
                    // Backend Infrastructure
                    env.BUILD_EUREKA_SERVER = changes.any { 
                        it.startsWith('backend/eureka-server/') || 
                        it == 'jenkinsfiles/Jenkinsfile.eureka-server' 
                    } ? 'true' : 'false'

                    env.BUILD_API_GATEWAY = changes.any { 
                        it.startsWith('backend/api-gateway/') || 
                        it == 'jenkinsfiles/Jenkinsfile.api-gateway' 
                    } ? 'true' : 'false'

                    // Backend Services
                    env.BUILD_ANGULAR_SERVICE = changes.any { 
                        it.startsWith('backend/Angular-spring-backend/') || 
                        it == 'jenkinsfiles/Jenkinsfile.angular-service' 
                    } ? 'true' : 'false'
                    
                    env.BUILD_REACT_SERVICE = changes.any { 
                        it.startsWith('backend/React-spring-backend/') || 
                        it == 'jenkinsfiles/Jenkinsfile.react-service' 
                    } ? 'true' : 'false'
                    
                    // Frontend MFEs
                    env.BUILD_ANGULAR_MFE = changes.any { 
                        it.startsWith('frontend/angular-child-app/') || 
                        it == 'jenkinsfiles/Jenkinsfile.angular-mfe' 
                    } ? 'true' : 'false'
                    
                    env.BUILD_REACT_MFE = changes.any { 
                        it.startsWith('frontend/react-child-app/') || 
                        it == 'jenkinsfiles/Jenkinsfile.react-mfe' 
                    } ? 'true' : 'false'

                    env.BUILD_SHELL = changes.any { 
                        it.startsWith('frontend/shell/') || 
                        it == 'jenkinsfiles/Jenkinsfile.shell' 
                    } ? 'true' : 'false'

                    // Rebuild all if critical infrastructure changed
                    def infrastructureChanged = changes.any { 
                        it == 'docker-compose.yml' ||
                        it == 'Jenkinsfile'
                    }

                    if (infrastructureChanged) {
                        echo "Infrastructure changed - rebuilding all services"
                        env.BUILD_EUREKA_SERVER = 'true'
                        env.BUILD_API_GATEWAY = 'true'
                        env.BUILD_ANGULAR_SERVICE = 'true'
                        env.BUILD_REACT_SERVICE = 'true'
                        env.BUILD_ANGULAR_MFE = 'true'
                        env.BUILD_REACT_MFE = 'true'
                        env.BUILD_SHELL = 'true'
                    }

                    echo """
                    Services to build:
                    - Eureka Server: ${env.BUILD_EUREKA_SERVER}
                    - API Gateway: ${env.BUILD_API_GATEWAY}
                    - Angular Service: ${env.BUILD_ANGULAR_SERVICE}
                    - React Service: ${env.BUILD_REACT_SERVICE}
                    - Angular MFE: ${env.BUILD_ANGULAR_MFE}
                    - React MFE: ${env.BUILD_REACT_MFE}
                    - Shell: ${env.BUILD_SHELL}
                    """
                }
            }
        }

        // Build Infrastructure First
        stage('Build Infrastructure') {
            parallel {
                stage('Eureka Server') {
                    when { expression { env.BUILD_EUREKA_SERVER == 'true' } }
                    steps {
                        build job: "${EUREKA_SERVER_JOB}", 
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
                stage('API Gateway') {
                    when { expression { env.BUILD_API_GATEWAY == 'true' } }
                    steps {
                        build job: "${API_GATEWAY_JOB}", 
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
            }
        }

        // Build Backend Services
        stage('Build Backend Services') {
            parallel {
                stage('Angular Service') {
                    when { expression { env.BUILD_ANGULAR_SERVICE == 'true' } }
                    steps {
                        build job: "${ANGULAR_SERVICE_JOB}",
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
                stage('React Service') {
                    when { expression { env.BUILD_REACT_SERVICE == 'true' } }
                    steps {
                        build job: "${REACT_SERVICE_JOB}",
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
            }
        }

        // Build Frontends
        stage('Build Frontends') {
            parallel {
                stage('Angular MFE') {
                    when { expression { env.BUILD_ANGULAR_MFE == 'true' } }
                    steps {
                        build job: "${ANGULAR_MFE_JOB}",
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
                stage('React MFE') {
                    when { expression { env.BUILD_REACT_MFE == 'true' } }
                    steps {
                        build job: "${REACT_MFE_JOB}",
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
                stage('Shell') {
                    when { expression { env.BUILD_SHELL == 'true' } }
                    steps {
                        build job: "${SHELL_JOB}",
                              parameters: [string(name: 'BRANCH', value: env.TARGET_BRANCH)],
                              wait: true, propagate: true
                    }
                }
            }
        }
    }

    post {
        success {
            echo "All builds completed successfully for branch: ${env.TARGET_BRANCH}"
        }
        failure {
            echo 'One or more builds failed. Check individual job logs.'
        }
        always {
            cleanWs()
        }
    }
}