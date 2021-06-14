'use strict'

import * as admin from 'firebase-admin'

// Initialize Firebase
const _serviceAccount: any = {
	"type": "service_account",
	"project_id": "kallamaysoft",
	"private_key_id": "5bc8dbf65be8e6e957e53b34a9ec414d96c77921",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7OfO9rHwZgRph\nxsMjNmc7FHYwsga3YJAayboF8Sf6PlY+JFs3q707jXWUjFiIYZbNYsYkjnHwGuqk\nEVjreG4ukvvFTGmi+wNI8opdCZEaAi31CUKwgJH+VpqBPvj5eLcIxhjuB6X7+KE0\nFQPHAmldjliD8d7EA4D9ZrfcPWdgaeB86cV0IOUMz4DDkMiGXMskzilQ5PVS9Ojk\nsSFMTBmgDfBzfpx59i9put55P002nyigRrnii/tS8L1qdYxBudhAtcMRqsYacrVC\nGn4Ck4KxUR4TEOO2TyqaCDmuxV4GjSjkSA/msazhpTNnkc86cdB+539/FMZrRXKz\noogz5nX3AgMBAAECggEAVYdHUA4EERiXpzQH/8WCCgyyY1NoWwwbOImP19gPNbOV\nbUTpgLiNNS/Nl2M3rHG8VK37K0cBSLjbGMEt+D+nQdJ2fm6GUWRO31uhFphgt1to\niChHVV8ekmwYn9NXJIvfPXxVdiN7UWyGo8a314lD/e+hgwESjUO2gMwUUOGiIHnj\nX9Fq4+P1yezubY0AbCmgDaxDm7HATPEoiCqyYx18ynIjIAs04sfXM//hywDah8xE\nQj0gVy2IqihsprH4RwohCfpXrN//17+/FvpKdABzcm5/TKETuAzqbho5IPTYalzQ\nWMn5AOupBfCfKeHG6KA/d+7LawA0v8zwlVEAbkfYWQKBgQD9YKqEbb8uyAUtpRih\nxfcJWO8z/0GqSGlyEDWeZ+y0iGUc2IJbUP1auf1IY6d0+wms+l5id/DHRGoqL+Y1\n+lyZxokJNkLruumnJ422qL7+G8hSG79MA+4BRdYqJ2vY84KZ6oWtAFBMgEJKdGcK\n9/exPOsCTQqdXgEA4uwWwLL4iQKBgQC9KgQIgV/SGk2xXeVeFBjiBrt7jPpPn2/h\nGxxSmBmagp5Z5kF6iDw3TPkdaDF3Ay4NIM0zSmwBAabPKSUhmvmxuZAyZqaUjaL3\nMJP1L2+QBZtR+WBSnhiCWyVmLWYsAtb03wA9otyCZ0fsLGt8UnUPJpHpkQsBN7ML\n9aFayJVafwKBgCzENnxdU4j1aAzPfZGfg20QXHroX3axgofXm1GYdPbUnmDBVA7E\nOW8dK0Xt7Xk6nVQFjEWDgXQDf2piuh7RVCkLLc0F3D7/8CZLU7txBwWobPUs19ib\nXSK2bwdVnbVgGLQO/n05b/aENrIm7MnAU+/pnm/yoqx5Hl5EuYevli9ZAoGAVwbo\neh1DPz8YtVwUdTbbx8j/IjVWx6D7cN3vJtSRGvOy9Hspbr0UrwB7r5rK/wz4d9O6\ndDlt/PyMiMxOJ+rLq4dKntV5F+kdq4mu2GNteR4LOih3tyrC7d4PE7YZRnA8AsZB\nrxmpR1lKzo4VGUo6TrEY+hLftDyy4/KqvECB7fMCgYEAoNkrToIXlAoRsSrvy4cY\nNE7QRD9LHlcLDTXKjhmevwops8y2bYq/C/I+O8ZHeMIgT9EDXyUvXul5HsmXGcQT\n7DI4lc60uGIiN41Y0CfTqxYPLeDAbohBEy1bAgPJRiomp6gKBBRpxctVJmNKLB25\nsD65laI6H6OzZjG72iP+iHQ=\n-----END PRIVATE KEY-----\n",
	"client_email": "firebase-adminsdk-6hbqz@kallamaysoft.iam.gserviceaccount.com",
	"client_id": "117949272407125386203",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6hbqz%40kallamaysoft.iam.gserviceaccount.com",
}

class AppConfig {

	registryFirebaseAdmin = () => {
		return admin.initializeApp({
			credential: admin.credential.cert(_serviceAccount),
			databaseURL: "https://kallamaysoft.firebaseio.com",
		})
	}
}

const appConfig = new AppConfig()
export default appConfig
