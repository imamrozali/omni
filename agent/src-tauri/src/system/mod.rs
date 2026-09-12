use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct SystemInfo {
    pub os_name: String,
    pub arch: String,
}

pub fn get_system_info() -> SystemInfo {
    SystemInfo {
        os_name: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_system_info() {
        let info = get_system_info();
        assert!(!info.os_name.is_empty());
        assert!(!info.arch.is_empty());
    }
}
