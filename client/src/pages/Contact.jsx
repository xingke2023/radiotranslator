import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="pb-10">
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-lg opacity-90">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{t('contact.form.title')}</h2>
              <p className="text-gray-600 mb-8">{t('contact.form.description')}</p>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                  {t('contact.form.success')}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800">{t('contact.form.subject')}</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800">{t('contact.form.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-lg"
                >
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{t('contact.info.title')}</h2>
              <p className="text-gray-600 mb-8">{t('contact.info.description')}</p>

              <div className="space-y-6">
                {/* Email */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-start">
                    <div className="text-3xl mr-4">📧</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{t('contact.info.email.title')}</h3>
                      <a href="mailto:dev2@xingke888.com" className="text-primary hover:underline">
                        dev2@xingke888.com
                      </a>
                      <p className="text-gray-600 text-sm mt-2">{t('contact.info.email.desc')}</p>
                    </div>
                  </div>
                </div>

                {/* Office */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-start">
                    <div className="text-3xl mr-4">🏢</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{t('contact.info.office.title')}</h3>
                      <p className="text-gray-700">
                        HONGKONG MACRODATA TECHNOLOGY LIMITED<br />
                        UNIT 27, /F 15 STAR HSE<br />
                        NO.SALISBURY RD TSIM SHA TSUI<br />
                        HONG KONG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-start">
                    <div className="text-3xl mr-4">🕐</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{t('contact.info.hours.title')}</h3>
                      <p className="text-gray-700">
                        {t('contact.info.hours.weekdays')}<br />
                        {t('contact.info.hours.timezone')}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">{t('contact.info.hours.desc')}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl">
                  <h3 className="font-bold mb-3">{t('contact.info.social.title')}</h3>
                  <p className="mb-4 opacity-90">{t('contact.info.social.desc')}</p>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg">
                      <span className="text-2xl">🐦</span>
                    </a>
                    <a href="#" className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg">
                      <span className="text-2xl">📘</span>
                    </a>
                    <a href="#" className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg">
                      <span className="text-2xl">📸</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
