import Footer from '../components/Footer';

function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-excon font-bold mb-8 text-black">Privacy Policy</h1>
                
                <div className="prose prose-slate max-w-none space-y-6 text-zinc-600 font-sans leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
                        <p>
                            Welcome to EquityExplorer. We respect your privacy and are committed to protecting your personal data. 
                            This privacy policy will inform you about how we look after your personal data when you visit our website 
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">The Data We Collect</h2>
                        <p>
                            When you use Meta/Facebook Login to access EquityExplorer, we collect basic profile information 
                            provided by Meta, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name</li>
                            <li>Email Address</li>
                            <li>Public Profile Picture</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Data</h2>
                        <p>
                            We use this information solely for authentication purposes and to personalize your experience on the platform. 
                            We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally 
                            lost, used, or accessed in an unauthorized way.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PrivacyPage;
