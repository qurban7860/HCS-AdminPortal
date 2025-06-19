import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useFormContext, Controller } from 'react-hook-form'
import { CONFIG } from '../../config-global'

export default function RHFReCaptchaV2({ name }) {
    const { control, setValue } = useFormContext()
    const captchaRef = useRef(null)
    const widgetIdRef = useRef(null)
    useEffect(() => {
        const scriptId = 'recaptcha-v2-script'

        const loadScript = () =>
            new Promise((resolve, reject) => {
                if (document.getElementById(scriptId)) {
                    resolve()
                    return
                }
                const script = document.createElement('script')
                script.id = scriptId
                script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
                script.async = true
                script.defer = true
                script.onload = resolve
                script.onerror = reject
                document.body.appendChild(script)
            })

        loadScript()
            .then(() => {
                if (window.grecaptcha && window.grecaptcha.ready) {
                    window.grecaptcha.ready(() => {
                        if (captchaRef.current && widgetIdRef.current === null) {
                            widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
                                sitekey: CONFIG.RECAPTCHA_KEY,
                                callback: (token) => setValue(name, token),
                                'expired-callback': () => setValue(name, null)
                            })
                        }
                    })
                }
            })
            .catch((err) => console.error('reCAPTCHA failed to load', err))
    }, [name, setValue])

    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
                <>
                    <div ref={captchaRef} />
                    {error && <p style={{ color: 'red', marginTop: 4 }}>{error.message}</p>}
                </>
            )}
        />
    )
}

RHFReCaptchaV2.propTypes = {
    name: PropTypes.string.isRequired
}

