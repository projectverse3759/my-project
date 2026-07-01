async function verifyAccessKey() {
    const userKey = document.getElementById('download-passkey').value.trim();
    const errorMsg = document.getElementById('locker-error-msg');
    const successMsg = document.getElementById('locker-success-msg');
    const downloadZone = document.getElementById('protected-download-zone');

    // Reset state
    errorMsg.classList.add('hidden');
    successMsg.classList.add('hidden');
    downloadZone.innerHTML = '';

    if (!userKey) return;

    try {
        const response = await fetch('/api/fetch-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: userKey })
        });
        
        const result = await response.json();
        
        if (result.success) {
            successMsg.classList.remove('hidden');
            downloadZone.innerHTML = `
                <div class="p-3 bg-white rounded-2xl border border-emerald-200 mt-2 shadow-sm">
                    <a href="/download/${encodeURIComponent(userKey)}" class="flex items-center p-2 hover:bg-slate-50 rounded-xl transition">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                            <i class="fa-solid fa-cloud-arrow-down"></i>
                        </div>
                        <div class="ml-3">
                            <span class="block text-sm font-bold text-slate-800">${result.data.title || "Download File"}</span>
                            <span class="block text-[10px] text-slate-500">Click to securely download</span>
                        </div>
                    </a>
                </div>`;
        } else {
            errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Fetch error:", error);
        errorMsg.innerText = "Connection error. Please try again.";
        errorMsg.classList.remove('hidden');
    }
}
</script>
