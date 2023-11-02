pipeline {
    agent any

    stages {
        stage('Building docker app and mongodb image') {
            steps {
                    // Authenticate Docker
                    sh '''
                        gcloud auth activate-service-account --key-file=SA_key.json
                        yes | gcloud auth configure-docker us-east1-docker.pkg.dev 
                    '''
                                        // Pull and Push MongoDB Image
                    sh '''
                        echo "Pulling mognodb image ..." 
                        sudo docker pull bitnami/mongodb:4.4.4
                        echo "Pulled mognodb image ..." 
                        sudo docker tag bitnami/mongodb:4.4.4 us-east1-docker.pkg.dev/halogen-data-401020/private-vm-repo/mongodb:latest
                        echo "Pushing mognodb image ..." 
                        sudo docker push us-east1-docker.pkg.dev/halogen-data-401020/private-vm-repo/mongodb:latest
                        echo "Image Pushed ..." 
                    '''

                    // Pull and Push App Image
                    sh '''
                        echo "Pulling app image ..."
                        sudo docker pull moelshafei/nodeapp:latest
                        echo "Image Pulled ..." 
                        sudo docker tag moelshafei/nodeapp:latest us-east1-docker.pkg.dev/halogen-data-401020/private-vm-repo/app:latest
                        sudo docker push us-east1-docker.pkg.dev/halogen-data-401020/private-vm-repo/app:latest
                        echo "Image Pushed" 
                    '''


            }
        }
        stage('getting gke credintials') {
            steps {
                echo 'Deploying....'
                sh '''
                sudo apt-get install kubectl
                echo "kubectl installed ..." 
                export KUBECONFIG=$HOME/.kube/config
                gcloud container clusters get-credentials gke-cluster --zone us-central1 --project halogen-data-401020 
                '''
            }
        }
        stage('Deploying app and database') {
            steps {
                echo 'Deploying....'
                sh '''
                cd /
                kubectl get nodes
                kubectl apply -f ./kubernetes/mongodb
                kubectl apply -f ./kubernetes/app-deployment
                sleep 120
                kubectl get pods -n staging
                kubectl get pods -n database
                kubectl get svc -n staging
                '''
            }
        }
    }
}