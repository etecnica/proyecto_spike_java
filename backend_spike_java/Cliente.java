public class Cliente {

    private int id;
    private String nombre;
    private String correo;
    private String direccionEntrega;
    private String password;
    private String rol;

    public Cliente() {
    }

    public Cliente(int id, String nombre, String correo, String direccionEntrega, String password, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.direccionEntrega = direccionEntrega;
        this.password = password;
        this.rol = rol;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }


    public String getDireccionEntrega() {
        return direccionEntrega;
    }

    public void setDireccionEntrega(String direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}