import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="container mx-auto mt-auto py-4 text-center text-sm text-gray-500">
            <p>
                Built with ❤️ by{" "}
                <a href="https://twitter.com/julienblanchon" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @julienblanchon
                </a>{" "}
                and{" "}
                <a href="https://twitter.com/jeremie_feron" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @jeremie_feron
                </a>
            </p>
            <p className="mt-2 flex justify-center items-center">
                Open source on{" "}
                <a href="https://github.com/julien-blanchon/share-csv" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:underline">
                    <svg className="h-4 w-4 mx-1" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                </a>
            </p>
        </footer>
    );
};

export default Footer;
