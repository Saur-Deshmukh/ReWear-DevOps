pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_BACKEND = 'saurdeshmukh/devops-lab-backend'
        IMAGE_FRONTEND = 'saurdeshmukh/devops-lab-frontend'
    }

    stages {

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    script {
                        def scannerHome = tool 'sonar-scanner' // matches the name you set in Tools
                        sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=rewear \
                            -Dsonar.sources=."
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $IMAGE_BACKEND ./Backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $IMAGE_FRONTEND ./Frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                docker push $IMAGE_BACKEND
                docker push $IMAGE_FRONTEND
                '''
            }
        }
    }
}