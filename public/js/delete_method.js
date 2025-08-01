async function delete_(url) {
    console.log(url);
    let confirmation = confirm(`Yakin mau menghapus "${url}"`) ; 

    if (confirmation) {
        let respons = await fetch(`/article/${url}`, {
            method : 'DELETE'
        })

        if (respons.ok) {
            console.log("Data terhapus");
        }else{
            console.log("Data gagal dihapus");
            
        }
    }


}