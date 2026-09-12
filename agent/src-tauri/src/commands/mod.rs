use crate::system::{get_system_info, SystemInfo};

#[tauri::command]
pub fn get_sys_info() -> Result<SystemInfo, String> {
    Ok(get_system_info())
}

#[tauri::command]
pub fn ping_agent() -> String {
    "pong".to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ping_agent() {
        assert_eq!(ping_agent(), "pong");
    }

    #[test]
    fn test_get_sys_info() {
        let result = get_sys_info();
        assert!(result.is_ok());
    }
}
