export class ProfilePanel {
  constructor({ store, http }) {
    this.store = store;
    this.http = http;
    this.root = document.createElement('div');
    this.root.className = 'profile-panel';
    this.root.innerHTML = this.getTemplate();
    this.profileForm = this.root.querySelector('[data-profile-form]');
    this.passwordForm = this.root.querySelector('[data-password-form]');
    this.messageEl = this.root.querySelector('[data-profile-msg]');
    this.passwordMsg = this.root.querySelector('[data-password-msg]');
    this.bindEvents();
    this.unsubscribe = this.store.subscribe((state) => this.render(state));
  }

  bindEvents() {
    // Avatar upload
    const avatarInput = this.root.querySelector('#avatarInput');
    const uploadBtn = this.root.querySelector('#uploadAvatarBtn');
    const avatarMsg = this.root.querySelector('#avatarMsg');
    
    uploadBtn.addEventListener('click', () => avatarInput.click());
    
    avatarInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        avatarMsg.textContent = 'Vui lòng chọn file ảnh';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        avatarMsg.textContent = 'Ảnh không được vượt quá 5MB';
        return;
      }
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Đang tải lên...';
      
      try {
        const response = await fetch('/api/users/me/avatar', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('messzola_token')}` },
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload thất bại');
        }
        
        const profile = await response.json();
        this.store.setUser(profile);
        avatarMsg.textContent = '✓ Đã cập nhật avatar';
        avatarMsg.style.color = 'var(--color-accent)';
      } catch (err) {
        avatarMsg.textContent = err.message;
        avatarMsg.style.color = '#EF4444';
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Chọn ảnh avatar';
      }
    });
  }
}