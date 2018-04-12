document.querySelector('#file-input').addEventListener('change', function() {
    if (this.files && this.files.length === 1) {
        document.body.classList.add('target-selected');
    }
});