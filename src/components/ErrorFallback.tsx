export const ErrorPage = ({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Oops, terjadi kesalahan!</h1>
            <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Terjadi kesalahan'}
            </p>
            <button onClick={resetErrorBoundary} className="bg-primary text-white px-4 py-2 rounded">Coba lagi</button>
        </div>
    );
};