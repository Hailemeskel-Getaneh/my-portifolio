import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import config from '../config';
import './Contact.css';

export default function Contact() {
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('Transmitting packet...');

        const formData = new FormData(e.target);
        const payloadData = {
            sender_name: formData.get('sender_name'),
            reply_to: formData.get('reply_to'),
            payload: formData.get('payload')
        };

        try {
            const response = await fetch(`${config.API_URL}/public/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData)
            });

            if (!response.ok) throw new Error('Transmission failed');

            setStatus('Sending packet... [OK] Message securely logged.');
            e.target.reset();
        } catch (error) {
            setStatus('Error: Connection refused or packet lost.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(''), 4000);
        }
    };

    return (
        <section className="contact-section" id="contact">
            <motion.h2
                className="section-title text-center mx-auto mb-10"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="gradient-text">Initiate Handshake</span>
            </motion.h2>

            <motion.div
                className="terminal-form"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="terminal-header">
                    <div className="terminal-dot dot-red">
                        <X size={8} />
                    </div>
                    <div className="terminal-dot dot-yellow">
                        <Minus size={8} />
                    </div>
                    <div className="terminal-dot dot-green"></div>
                    <div className="terminal-title">bash -- ~/contact_form.sh</div>
                </div>
                <div className="terminal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">const sender_name =</label>
                            <input type="text" name="sender_name" required className="form-input" placeholder='"John Doe";' />
                        </div>
                        <div className="form-group">
                            <label className="form-label">const reply_to =</label>
                            <input type="email" name="reply_to" required className="form-input" placeholder='"john@example.com";' />
                        </div>
                        <div className="form-group">
                            <label className="form-label">const payload =</label>
                            <textarea name="payload" required className="form-textarea" placeholder='"Your message here...";'></textarea>
                        </div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? '[Processing...]' : '> Execute ping'}
                        </button>
                        {status && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-green-400 text-sm"
                            >
                                {status}
                            </motion.p>
                        )}
                    </form>
                </div>
            </motion.div>
        </section>
    );
}
