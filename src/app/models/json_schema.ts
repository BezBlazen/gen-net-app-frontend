const jsonSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://gedcomx.org/schema/v1.0",
  "title": "GEDCOM X JSON Schema",
  "description": "Schema for GEDCOM X genealogical data format",
  "type": "object",
  "$uri": {
    "Male": {
      "type": "string",
      "const": "http://gedcomx.org/Male",
      "title": "Male"
    },
    "Female": {
      "type": "string",
      "const": "http://gedcomx.org/Female",
      "title": "Female"
    },
    "Unknown": {
      "type": "string",
      "const": "http://gedcomx.org/Unknown",
      "title": "Unknown"
    }
  },
  "$defs": {
    "Person": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "gender": { "$ref": "#/$defs/Gender" }
      },
      "required": ["id"]
    },
    "Gender": {
      "title": "Gender",
        "description": "Valid gender types",
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "oneOf": [
              { "$ref": "#/$uri/Male" },
              { "$ref": "#/$uri/Female" },
              { "$ref": "#/$uri/Unknown" }
          ]
        }
      },
      "required": ["type"]
    }
  },
  "properties": {
    "persons": {
      "type": "array",
      "items": { "$ref": "#/$defs/Person" }
    }
  }
}