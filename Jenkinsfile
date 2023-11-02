pipeline {
    agent any

    stages {
        stage('Building docker app and mongodb image') {
            steps {
                    // Authenticate Docker
                    sh '''
                        cd /tmp
                        sudo wget --header="Metadata-Flavor: Google" -O key.json http://metadata.google.internal/computeMetadata/v1/instance/attributes/ssh-keys
                        cat key.json | base64 -d > key1.json
                        gcloud auth activate-service-account --key-file=key1.json
                        yes | gcloud auth configure-docker us-east1-docker.pkg.dev 
                        cat key.json | sudo docker login -u _json_key_base64 --password-stdin https://us-east1-docker.pkg.dev
                        cd /
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
            }
        }
        stage('getting gke credintials') {
            steps {
                echo 'Deploying....'
                sh '''
                sudo apt-get install kubectl
                echo "kubectl installed ..." 
                sudo apt-get install google-cloud-sdk-gke-gcloud-auth-plugin
                echo "google auth ..."
                export KUBECONFIG=$HOME/.kube/config
                gcloud container clusters get-credentials gke-cluster --zone us-central1 --project halogen-data-401020 --internal-ip
                gcloud container clusters update gke-cluster --zone us-central1  --enable-master-global-access
                '''
            }
        }
        stage('Deploying app and database') {
            steps {
                echo 'Deploying....'
                sh '''
                cd /
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