'use strict'

import * as admin from 'firebase-admin'

// Initialize Firebase
const _serviceAccount: any = {
  "type": "service_account",
  "project_id": "minglemaysoft",
  "private_key_id": "f03f068ba8a0f0edeffa7bbf39815b4451f52ed6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDr29cJHbqACRAR\nJObCnc5EmnVftznY9XDm2OrhpIqjMFz7NORI/pyZI3nIukF83T/oQG6ZNpwj4Kpf\nWTEKtZZ5hXNn/ypyasrMaeS7cpgx+A37IFgs3yQPq2FZ09g0ECP8kGn3Eb4XgsTY\nzVrR4R4a5lCTt8aZemNm50/bnUFAQetChB/U21MDUjS87IIwpKkGzVSkJX16/zoo\nmLFBTxBdcwiQI1h/lnUdLM+hFYyqqek+hAeA5FvCwmBn/nfwnnaBSAl6dCAXZn1W\ngK/OdYP49qUmpx8lzGqHc+Bm1wmV/2Z4yTZYRP1709JxZ4JgxnP/94O8vL4gzLgo\nFgdSRPVzAgMBAAECggEAaA5F6RIyEUGuUnn+ytbXRUIFzZQnE9Z5GIeT3Lf8qDFy\nnCuCGcgm65MQrCOsN7ve8YbXpIXIzjVUxRsy/UAO4o8jUrrrDa6aySNg0+gjSExh\nUq066ZUKslUQbpJ9XL7QOaG29ldgD7xUPzgePOE+KGz7GKioGFc8Go6rlz7iJkf2\nAuZM9P0/7LjaX2c3vjOCi9N55p2fahQu/TLNhyL8/rjmeWdFs2QVv4kb+FqBU4c/\nfd43F8Lp6x+YyQpwx0Qfn+qBsdHeKww3+tPSR7HTq0JEEBjKBoH4pN2lkbU7iwch\nskxwevT2VAuoyBHoPFb5NXs74bDp89p90t/ZALpKcQKBgQD2KwjyAFN93SC+dtId\nJsxh33cudhOf8k6D4v/Sco6O56ImzqdnUTj8wgrK1DMozCeXgxvNzMWRzZuIhiFx\nDrHZO8OpLU8XvKjcwNHYm3icMuE9tfmmmQJrYKleydGNKlISnZAfNN8UfGbYDag1\nmJeJLaNlRTBW3alMhG2DSbeZAwKBgQD1R2VvVFl3ClKjGEzzH6ip1BYtUMJwubSD\noepJBm4ggK9mE3lxweRtCh2cAlqU3eyNwtjaXk/McNruEJM3l0gSmZSHgQLEjSJe\nKD2Q6n/SXlQhu933sxZIB7uq5pz4oqwPOIVSIQINYPYfouj1rtrEukk79vj4RCXx\nOaJzrMuu0QKBgQDP6GLiuWHKwNNh6crl8hnWY70uEW3bvfOQMk1sOXKrwXjTG+CJ\nQzFFUMF6syQORfb+YS4/b75BuYyuDtL5wLZ2yaIkJW9SlfVslLHnJtAD5HkV/LbA\nfSRs+jOyKfQBLQgqTsclhCsRC0x1F3vE4H7DzjbdVkVQaGAPjx1LMByPbwJ/aG79\nwWkoroa2qLqwCNRx+91Rk/nO0DBBq8pE9tLGERC5nbys+MKVf9fOw5488yWKktFj\ng5akY2epz7M++2xuQ30gwJEtnIJ7H5wCmrE9u1Rufe5/k/eshP7F6P5H15VrrQ9j\ntJRZS1j9cnrqtbC9dQXcKKv/VbWucgcYJChukQKBgCOl02OEIbRMQsiPb4zbpMrO\nSMlhUZiJyvugBkPgy6cCNKh3FPNprVkiAnNNL8+SynCuBTy9lRzFeNcqiYP+fhGs\nX7S5sm0lWpDvVifLCIyKDZyNB6tr7PBqn7VMY2/ds8QK7O2vIXoDzdbJ7f0wHStD\nsJlCv8B1meTkw+yOVdb3\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-79l3g@minglemaysoft.iam.gserviceaccount.com",
  "client_id": "116727097808413839695",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-79l3g%40minglemaysoft.iam.gserviceaccount.com"
}

class AppConfig {

	registryFirebaseAdmin = () => {
		return admin.initializeApp({
			credential: admin.credential.cert(_serviceAccount),
			databaseURL: "https://minglemaysoft.firebaseio.com",
		})
	}
}

const appConfig = new AppConfig()
export default appConfig
