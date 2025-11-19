export class GroupPanel {
  constructor({ store, http, onSelectRoom }) {
    this.store = store;
    this.http = http;
    this.onSelectRoom = onSelectRoom;
    this.root = document.createElement('div');
    this.root.className = 'group-panel';
    this.root.innerHTML = this.getTemplate();
    this.createGroupForm = this.root.querySelector('[data-create-group-form]');
    this.groupNameInput = this.root.querySelector('[data-group-name]');
    this.friendCheckboxes = this.root.querySelector('[data-group-friends]');
    this.groupsList = this.root.querySelector('[data-groups-list]');
    this.inviteDialog = null;
    this.latestState = null;
    this.bindEvents();
    this.unsubscribe = this.store.subscribe((state) => this.render(state));
  }

  bindEvents() {
    this.createGroupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = this.groupNameInput.value.trim();
      const checkboxes = this.friendCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
      const memberIds = Array.from(checkboxes).map(cb => cb.value);
      
      if (!name || memberIds.length === 0) {
        alert('Vui lòng nhập tên nhóm và chọn ít nhất 1 thành viên');
        return;
      }
      
      const submitBtn = this.createGroupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang tạo...';
      
      try {
        await this.http.post('/rooms/group', { name, memberIds });
        this.groupNameInput.value = '';
        checkboxes.forEach(cb => cb.checked = false);
        await this.reloadRooms();
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✓ Tạo nhóm thành công!';
        this.createGroupForm.insertAdjacentElement('afterend', successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } catch (err) {
        alert(err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  formatRooms(rooms) {
    return rooms.map((room) => ({
      ...room,
      members: room.members || '',
      is_group: Number(room.is_group)
    }));
  }

  async reloadRooms() {
    const rooms = await this.http.get('/rooms');
    this.store.setRooms(this.formatRooms(rooms));
  }
}