import Footer from '../components/Footer';

function DataDeletionPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-excon font-bold mb-8 text-black">Data Deletion Instructions</h1>
                
                <div className="prose prose-slate max-w-none space-y-6 text-zinc-600 font-sans leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">How to Request Data Deletion</h2>
                        <p>
                            EquityExplorer values your data privacy. If you wish to delete your account and all associated data 
                            collected through Meta/Facebook or any other authentication method, please follow the instructions below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">Method 1: Contact Support</h2>
                        <p>
                            You can request the deletion of your account and personal data by sending an email to our support team:
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block font-mono text-black">
                            support@equityexplorer.vercel.app
                        </div>
                        <p className="mt-4">
                            Please include your username and the email associated with your account. We will process your 
                            request within 48 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">Method 2: Meta Platform Settings</h2>
                        <p>
                            If you used Facebook Login, you can also remove EquityExplorer's access to your data through 
                            your Facebook settings:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Go to your Facebook Profile's Settings & Privacy. Click Settings.</li>
                            <li>Look for "Apps and Websites" and you will see all of the apps and websites you've linked to Facebook.</li>
                            <li>Search and tap "EquityExplorer" in the search bar.</li>
                            <li>Scroll and tap "Remove".</li>
                        </ol>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DataDeletionPage;
