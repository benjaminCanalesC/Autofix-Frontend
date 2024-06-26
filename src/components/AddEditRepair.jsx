import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, FormGroup, FormLabel, FormControl, FormCheck } from 'react-bootstrap';
import { BsSave } from 'react-icons/bs';
import repairService from '../services/repair.service';

const AddEditRepair = () => {
    const [repair, setRepair] = useState({
        entryDateTime: "",
        exitDateTime: "",
        pickupDateTime: "",
        bonusDiscount: false,
        repairTypeId: "",
        vehiclePlate: ""
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const [titleRepairForm, setTitleRepairForm] = useState("");
    const [repairTypes, setRepairTypes] = useState([]);

    const fetchRepairTypes = () => {
        repairService.getRepairTypes().then(response => {
            setRepairTypes(response.data);
        }).catch(error => {
            console.error("Error al cargar los tipos de reparaciones.", error);
        });
    };

    const saveRepair = (e) => {
        e.preventDefault();
        const { repairTypeId, ...dates } = repair;
        const repairPost = {
            ...dates,
            repairType: { id: parseInt(repairTypeId) },
            vehicle: { plate: repair.vehiclePlate.toUpperCase() }
        };

        const action = id ? repairService.update({ id: parseInt(id), ...repairPost }) : repairService.create(repairPost);
        action.then(response => {
            navigate("/repair/list");
        }).catch(error => {
            console.error("Error al guardar la reparación.", error);
        });
    };

    const handleRepairChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = name === 'vehiclePlate' ? value.toUpperCase() : value;
        setRepair(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : updatedValue
        }));
    };

    useEffect(() => {
        fetchRepairTypes();
        if (id) {
            repairService.get(id).then(response => {
                const data = response.data;
                setRepair({
                    entryDateTime: data.entryDateTime,
                    exitDateTime: data.exitDateTime,
                    pickupDateTime: data.pickupDateTime,
                    bonusDiscount: data.bonusDiscount,
                    repairTypeId: data.repairType.id.toString(),
                    vehiclePlate: data.vehicle.plate,
                });
                setTitleRepairForm("Editar Reparación");
            }).catch(error => {
                console.error("Error al intentar obtener los datos de la reparación.", error);
            });
        } else {
            setTitleRepairForm("Nueva Reparación");
        }
    }, [id]);

    return (
        <Container style={{ marginTop: "4rem", maxWidth: "800px" }}>
            <h3>{titleRepairForm}</h3>
            <hr />
            <Form onSubmit={saveRepair}>
                <Form.Group className="mb-3">
                    <Form.Label>Patente del Vehículo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Agregar Patente"
                        name="vehiclePlate"
                        value={repair.vehiclePlate}
                        onChange={handleRepairChange}
                        maxLength="6"
                        readOnly={!!id}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tipo de Reparación</Form.Label>
                    <Form.Select
                        name="repairTypeId"
                        value={repair.repairTypeId}
                        onChange={handleRepairChange}
                    >
                        <option value="">Reparaciones...</option>
                        {repairTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.repairType}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Fecha y Hora de Entrada</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="entryDateTime"
                        value={repair.entryDateTime}
                        onChange={handleRepairChange}
                    />
                </Form.Group>
                {id && repair.entryDateTime && (
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora de Salida</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="exitDateTime"
                            value={repair.exitDateTime}
                            onChange={handleRepairChange}
                        />
                    </Form.Group>
                )}
                {repair.exitDateTime && (
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora de Recogida</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="pickupDateTime"
                            value={repair.pickupDateTime}
                            onChange={handleRepairChange}
                        />
                    </Form.Group>
                )}
                {!id && (
                    <FormGroup className="mb-3">
                        <FormCheck
                            type="checkbox"
                            label="Aplicar Bono de Descuento"
                            checked={repair.bonusDiscount}
                            onChange={handleRepairChange}
                            name="bonusDiscount"
                            className="form-check-inline form-switch"
                        />
                    </FormGroup>
                )}
                <Button type="submit" variant="primary" className="me-2">
                    <BsSave className="me-2" />Guardar Reparación
                </Button>
            </Form>
            <hr />
            <Link to="/repair/list">Volver a Lista</Link>
        </Container>
    );
};

export default AddEditRepair;
