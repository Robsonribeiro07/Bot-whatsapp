  public async GetUserData() {
    if (!this.sock?.user || !this.status) return

    try {
      const { id, jid, lid, name, notify, status, verifiedName } =
        this.sock.user
      if (!id) return

      let profilePictureUrl: string | undefined
      try {
        profilePictureUrl = await this.sock.profilePictureUrl(id, 'image')
      } catch (err) {
        console.warn('Erro ao obter foto de perfil:', err)
        profilePictureUrl = undefined
      }

      const updateData = {
        id,
        imgUrl: profilePictureUrl,
        jid,
        lid,
        name,
        notify,
        status,
        verifiedName,
      }

      if (!this.isUloadingDataRemote && this.socket) {
        this.socket.emit('new-user-data', updateData)
      }

      return updateData
    } catch (err) {
      console.error('Erro ao obter dados do usuário:', err)
    }
  }